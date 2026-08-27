// Voice of Goila - App/WebView Fresh Cache Fix v5
// Always prefer the live network while online. Cache is fallback only.
const CACHE = "voice-of-goila-v6-fresh-data";
const CORE = ["./", "./index.html", "./manifest.json"];

async function freshFetch(request) {
  // Avoid Android WebView/HTTP cache for navigations and same-origin app files.
  const freshRequest = new Request(request, { cache: "no-store" });
  return fetch(freshRequest);
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const url of CORE) {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response && response.ok) await cache.put(url, response.clone());
      } catch (_) {}
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith("voice-of-goila-") && key !== CACHE)
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await freshFetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) return cached;

      if (request.mode === "navigate") {
        const fallback = await caches.match("./index.html", { ignoreSearch: true });
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});

// Kept for browser/PWA compatibility. Native Android FCM remains separate.
self.addEventListener("push", event => {
  let data = { title: "Voice of Goila", body: "নতুন আপডেট এসেছে", url: "./" };
  try { data = { ...data, ...event.data.json() }; } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(data.title || "Voice of Goila", {
      body: data.body || "নতুন তথ্য দেখুন",
      icon: "/icons/icon-192.png",
      data: { url: data.url || "./" }
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification?.data?.url || "./";
  event.waitUntil(clients.openWindow(target));
});
