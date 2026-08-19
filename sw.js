// Voice of Goila - Final stable service worker
// Network-first strategy prevents GitHub Pages from serving an old cached CMS/public build.
const CACHE = "voice-of-goila-v3-final";
const CORE = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith("voice-of-goila-") && key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if(request.method !== "GET") return;

  const url = new URL(request.url);
  if(url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if(response && response.ok){
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request, {ignoreSearch:true});
      if(cached) return cached;
      if(request.mode === "navigate"){
        const fallback = await caches.match("./index.html", {ignoreSearch:true});
        if(fallback) return fallback;
      }
      throw error;
    }
  })());
});
