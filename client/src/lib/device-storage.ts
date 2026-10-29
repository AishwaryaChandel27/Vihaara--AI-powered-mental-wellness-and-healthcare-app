// All wellness records use the original keys so existing installations retain their data.
export function readRecords<T>(
  key: string,
  valid: (record: unknown) => record is T,
): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(valid))
    throw new Error(
      "Saved wellness data could not be read. Export a recovery copy before clearing it.",
    );
  return parsed;
}
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
export function downloadRecovery() {
  const snapshot: Record<string, string | null> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("mindmate-") || key?.startsWith("vihaara-"))
      snapshot[key] = localStorage.getItem(key);
  }
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "vihaara-recovery.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
