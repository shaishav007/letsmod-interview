import { VitePWAOptions } from "vite-plugin-pwa";

const CACHE_DAYS = 1;

export const workbox: Partial<VitePWAOptions["workbox"]> = {
  maximumFileSizeToCacheInBytes: 6000000,
  disableDevLogs: true,
  clientsClaim: true,
  skipWaiting: true,
  globPatterns: ["**/*.{js,css,html,ico,png,svg,json,mp3}"],
  runtimeCaching: [
    {

      
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * CACHE_DAYS,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "gstatic-fonts-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * CACHE_DAYS,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    {
      urlPattern: /^https:\/\/static-dev\.letsmod\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "cdn",
        expiration: {
          maxEntries: 300,
          maxAgeSeconds: 60 * 60 * 24 * CACHE_DAYS,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    {
      urlPattern: (url) => {
        return ["/api/Trays/prefabs", "/api/UIApps/findByShareId"].includes(
          url.url.pathname
        );
      },
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "machine-by-share-id",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * CACHE_DAYS,
        },
        cacheableResponse: {
          statuses: [0, 200],
          headers: {
            "X-Is-Cacheable": "true",
          },
        },
      },
    },
  ],
};
