import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const root = new URL("../dist/public/", import.meta.url);
const walk = async (dir, prefix = "") =>
  (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map(async (item) =>
        item.isDirectory()
          ? walk(new URL(item.name + "/", dir), prefix + item.name + "/")
          : prefix + item.name,
      ),
    )
  ).flat();
const files = (await walk(root)).filter((f) => f !== "sw.js");
const revision = createHash("sha256")
  .update(
    (await Promise.all(files.map((f) => readFile(new URL(f, root)))))
      .map((b) => createHash("sha256").update(b).digest("hex"))
      .join(),
  )
  .digest("hex")
  .slice(0, 12);
await writeFile(
  new URL("sw.js", root),
  `const CACHE='vihaara-shell-${revision}';
const ASSETS=${JSON.stringify(files.map((f) => "/" + f))};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('vihaara-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event => {
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(event.request.mode==='navigate') { event.respondWith(caches.open(CACHE).then(cache=>cache.match('/index.html')).then(cached=>cached||fetch(event.request))); return; }
 if(ASSETS.includes(url.pathname))event.respondWith(caches.open(CACHE).then(cache=>cache.match(url.pathname)).then(cached=>cached||fetch(event.request)));
});\n`,
);
console.log(
  `Offline shell generated: ${files.length} local assets, revision ${revision}.`,
);
