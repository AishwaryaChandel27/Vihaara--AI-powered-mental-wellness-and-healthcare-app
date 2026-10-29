import { Download, ShieldCheck, X } from "lucide-react";
import {
  useLocalAI,
  enableLocalAI,
  disableLocalAI,
  removeModelCache,
} from "@/lib/local-ai";
import { Button } from "./ui/button";
import { useState } from "react";
export default function LocalAIControl() {
  const status = useLocalAI();
  const [cacheMessage, setCacheMessage] = useState("");
  return (
    <section className="local-ai-panel" aria-label="AI mode">
      <div className="flex gap-3 items-start">
        <ShieldCheck size={20} className="shrink-0 mt-1 text-primary" />
        <div className="flex-1 min-w-0">
          <h2 className="font-sans font-semibold text-sm">
            {status.state === "ready"
              ? "Your on-device companion"
              : "A little intelligence. Entirely on your device."}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Use the prepared offline guide instantly, or enable a small AI
            model. The optional first download is several hundred MB and needs
            WebGPU and available memory. No account, API key, or inference fee.
            AI uses short recent excerpts, works best in English, and may be
            inaccurate. It is not medical care.
          </p>
          <p role="status" className="text-xs mt-2 break-words">
            {status.message}
          </p>
          {status.state === "loading" && (
            <progress
              className="w-full h-1.5 mt-2 accent-primary"
              value={status.progress}
              max={1}
              aria-label="Model download progress"
            />
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {status.state !== "ready" && status.state !== "loading" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => void enableLocalAI()}
              >
                <Download size={14} className="mr-2" />
                Enable on-device AI
              </Button>
            )}
            {(status.state === "ready" || status.state === "loading") && (
              <Button size="sm" variant="outline" onClick={disableLocalAI}>
                <X size={14} className="mr-2" />
                {status.state === "loading"
                  ? "Cancel download"
                  : "Use offline guide"}
              </Button>
            )}
            <button
              className="text-xs underline text-muted-foreground"
              onClick={async () => {
                try {
                  await removeModelCache();
                  setCacheMessage("Model cache removed.");
                } catch {
                  setCacheMessage(
                    "Could not clear model files. You can clear this site’s storage in browser settings.",
                  );
                }
              }}
            >
              Remove downloaded model
            </button>
          </div>
          {cacheMessage && (
            <p role="status" className="text-xs mt-2">
              {cacheMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
