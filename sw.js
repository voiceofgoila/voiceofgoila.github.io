// Voice of Goila - Complete Enhancement service worker
// Network-first: fresh GitHub Pages files first, cached fallback only when offline.
const CACHE="voice-of-goila-v4-complete";
const CORE=["./","./index.html","./manifest.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("voice-of-goila-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;e.respondWith((async()=>{try{const res=await fetch(r);if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy)).catch(()=>{});}return res;}catch(err){const cached=await caches.match(r,{ignoreSearch:true});if(cached)return cached;if(r.mode==="navigate"){const fallback=await caches.match("./index.html",{ignoreSearch:true});if(fallback)return fallback;}throw err;}})());});
