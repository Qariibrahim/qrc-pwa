const SITE_ORIGIN = "https://qrc.imdaderohani.in";
const LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhswMSCDL7cBASmV4gtFdF0w9bsk4vP5VtIRxJZYdqwzKCbCP35-cy9oYYCBTjhdhVQjQwS7P-Vdf5Z8PZLIaj-LtPsx6TvGOxdOTmMM-Y_oHvpEWd4JuVdCw9wyn2w-6p0Vdt4QLQXF80Qz-pWfpdX6DaIjlIXgiODrDffCsPdS6-AOIRCmkR0oZXGAuD9/s500/38030.png";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/manifest.webmanifest" || path === "/manifest.json") {
      const manifest = {
        id: "/",
        name: "Imdade Rohani",
        short_name: "Imdade Rohani",
        description: "Imdade Rohani ki roohani janch, maloomat aur online services.",
        start_url: "/?source=pwa",
        scope: "/",
        lang: "ur",
        dir: "rtl",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#f3f8ff",
        theme_color: "#002087",
        icons: [
          {src:"/pwa-icon-192.png",sizes:"192x192",type:"image/png",purpose:"any"},
          {src:"/pwa-icon-192.png",sizes:"192x192",type:"image/png",purpose:"maskable"},
          {src:"/pwa-icon-512.png",sizes:"512x512",type:"image/png",purpose:"any"},
          {src:"/pwa-icon-512.png",sizes:"512x512",type:"image/png",purpose:"maskable"}
        ]
      };
      return new Response(JSON.stringify(manifest, null, 2), {
        headers: {
          "Content-Type": "application/manifest+json; charset=UTF-8",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (path === "/service-worker.js") {
      return new Response(serviceWorkerCode(), {
        headers: {
          "Content-Type": "application/javascript; charset=UTF-8",
          "Service-Worker-Allowed": "/",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    }

    if (path === "/offline.html") {
      return new Response(offlineHtml(), {
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (path === "/pwa-icon-192.png") return serveIcon(192);
    if (path === "/pwa-icon-512.png") return serveIcon(512);

    return Response.redirect(SITE_ORIGIN, 302);
  }
};

async function serveIcon(size) {
  const resized = LOGO_URL.replace("/s500/", `/s${size}-c/`);
  const response = await fetch(resized, {
    cf: { cacheEverything: true, cacheTtl: 86400 }
  });
  if (!response.ok) return new Response("PWA icon could not be loaded.", {status:500});
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "image/png");
  headers.set("Cache-Control", "public, max-age=86400");
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(response.body, {status:200, headers});
}

function serviceWorkerCode() {
  return `
const VERSION = "imdaderohani-pwa-v1";
const PAGE_CACHE = VERSION + "-pages";
const STATIC_CACHE = VERSION + "-static";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => Promise.allSettled([
        cache.add(OFFLINE_URL),
        cache.add("/manifest.webmanifest"),
        cache.add("/pwa-icon-192.png"),
        cache.add("/pwa-icon-512.png")
      ]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => ![PAGE_CACHE, STATIC_CACHE].includes(key))
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const requestUrl = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(PAGE_CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL)))
    );
    return;
  }

  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request)
          .then(response => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then(cache => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
`;
}

function offlineHtml() {
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#002087"><title>انٹرنیٹ دستیاب نہیں</title><style>*{box-sizing:border-box}body{min-height:100vh;margin:0;padding:20px;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#001449,#002087,#1769c2);color:#fff;font-family:Arial,sans-serif;text-align:center}main{width:100%;max-width:430px;padding:30px 20px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:24px}img{width:110px;height:110px;padding:7px;object-fit:contain;border-radius:50%;background:#fff}h1{color:#ffd76a}button{padding:12px 25px;border:0;border-radius:50px;background:#ffd76a;color:#002087;font-weight:bold}</style></head><body><main><img src="/pwa-icon-192.png" alt="Imdade Rohani"><h1>انٹرنیٹ دستیاب نہیں</h1><p>براہِ کرم اپنے موبائل کا Internet یا Wi-Fi چیک کریں۔</p><button onclick="location.reload()">دوبارہ کوشش کریں</button></main></body></html>`;
}

