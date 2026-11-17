/* Kadya Jewels : met le site en cache pour l'ouvrir vite, même avec une connexion faible. */
var CACHE = "kadya-v1";
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(["/", "/favicon.png", "/icon-512.png", "/logo.png"]); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(n){ return n !== CACHE; }).map(function(n){ return caches.delete(n); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(function(res){
    if (res && res.ok) { var copie = res.clone(); caches.open(CACHE).then(function(c){ c.put(r, copie); }); }
    return res;
  }).catch(function(){ return caches.match(r).then(function(m){ return m || caches.match("/"); }); }));
});
