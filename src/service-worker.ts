import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", function (event) {
  // Activate worker immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  // Become available to all pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", async function (event) {
  console.log("I'M REVEVING SOMETHING", event);
  if (!event.data || !event.data.type) {
    return;
  }
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    if (client.id === (event.source as Client).id) {
      return;
    }

    switch (event.data.type) {
      case "copyPart":
        client.postMessage(event.data);
        break;
    }
  });
});

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// registerRoute(
//   new NavigationRoute(createHandlerBoundToURL("index.html"), {
//     allowlist: [/^\/$/],
//   })
// );

registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 86400,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*/i,
  new CacheFirst({
    cacheName: "gstatic-fonts-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 86400,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /^https:\/\/static-dev\.letsmod\.com\/.*/i,
  new StaleWhileRevalidate({
    cacheName: "cdn",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 86400,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
  "GET"
);
registerRoute(
  (url) => {
    return [
      "/api/Trays/prefabs",
      // "/api/UIApps/findByShareId"
    ].includes(url.url.pathname);
  },
  new StaleWhileRevalidate({
    cacheName: "machine-by-share-id",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 86400,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
        headers: {
          "X-Is-Cacheable": "true",
        },
      }),
    ],
  }),
  "GET"
);

// @ts-ignore
self.__WB_DISABLE_DEV_LOGS = true;

export {};
