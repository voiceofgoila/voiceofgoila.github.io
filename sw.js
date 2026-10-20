const CACHE='vog-public-shell-v22';
const PAGES=['./','./index.html','./category.html','./reviews.html','./submit.html','./goila-map.html','./goila-map-preview.html','./creator.html'];
const ASSETS=['./assets/goila-drone.png','./assets/goila-map-preview.png','./icons/icon-192.png','./icons/icon-512.png','./js/creator.js'];
const safePath=p=>!/(^|\/)(admin|reset-password)(\.html|\/|$)/i.test(p)&&!p.startsWith('/new/');
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await Promise.allSettled([...PAGES,...ASSETS].map(async p=>{try{const r=await fetch(p,{cache:'no-store'});if(r.ok&&r.type==='basic')await c.put(new Request(p),r)}catch(_){}}))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('vog-public-shell-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==self.location.origin||!safePath(u.pathname))return;
const isDoc=r.mode==='navigate';const isAsset=/\.(png|jpe?g|webp|svg|ico|css|js)$/i.test(u.pathname);if(!isDoc&&!isAsset)return;
e.respondWith((async()=>{const c=await caches.open(CACHE);if(isDoc){try{const fresh=await fetch(r,{cache:'no-store'});if(fresh.ok){await c.put(r,fresh.clone());return fresh}const old=await c.match(r,{ignoreSearch:true});return old||fresh}catch(_){return (await c.match(r,{ignoreSearch:true}))||(await c.match('./index.html'))||Response.error()}}
const old=await c.match(r,{ignoreSearch:true});if(old){e.waitUntil(fetch(r).then(f=>{if(f.ok&&f.type==='basic')return c.put(r,f.clone())}).catch(()=>{}));return old}try{const fresh=await fetch(r);if(fresh.ok&&fresh.type==='basic')e.waitUntil(c.put(r,fresh.clone()));return fresh}catch(_){return Response.error()}})())});
