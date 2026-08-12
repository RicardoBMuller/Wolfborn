const CACHE = "wolfborn-shell-v1";

const SHELL = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "assets/cover.png",
  "assets/icon-circle-192.png",
  "assets/icon-circle-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for the app shell: always fetch the latest HTML/CSS/JS when
// online (so future edits show up immediately), and only fall back to the
// cached copy if the request fails (offline). Songs/lyrics are untouched —
// they're not in SHELL, so they always go straight to the network.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const shellUrls = SHELL.map((path) => new URL(path, self.location).href);
  if (!shellUrls.includes(event.request.url)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
