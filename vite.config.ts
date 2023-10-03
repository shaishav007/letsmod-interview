import path from "path";
import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { VitePWA } from "vite-plugin-pwa";
import { splitVendorChunkPlugin } from "vite";
import { workbox } from "./tools/vite/workbox";
import fs from "fs";

const hasArgument = (name: string) => {
  const found = process.argv.find((arg) =>
    new RegExp(`^(?:--${name})$`, "g").test(arg)
  );
  return Boolean(found);
};

export default defineConfig(({ mode, ...rest }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const hmr = hasArgument("no-hmr") ? false : undefined;
  const browserUrl = hasArgument("no-browser") ? undefined : "./";

  return {
    define: {
      ENV: JSON.stringify(env["NODE_ENV"]),
    },
    server: {
      open: browserUrl,
      fs: {
        allow: [".."],
      },
      hmr,
    },

    preview: {
      open: browserUrl || false,
      port: 5173,
    },
    plugins: [
      // htmlPlugin(mode),
      splitVendorChunkPlugin(),
      viteStaticCopy({
        targets: [
          // {
          //   src: `../server/clientConfig/${mode}.json`,
          //   dest: "config",
          //   rename: "config.json",
          // },
        ],
      }),
      VitePWA({
        workbox,
        registerType: "autoUpdate",
        strategies: "injectManifest",
        srcDir: "src",
        filename: "service-worker.ts",
        injectManifest: {
          globPatterns: workbox.globPatterns,
        },
        devOptions: {
          enabled: true,
          type: "module",
        },
      }),
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
      },
    },
    base: "./",
  };
});

/**
 * Replace env variables in index.html
 * @see https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
 * @see https://vitejs.dev/guide/api-plugin.html#transformindexhtml
 */
function htmlPlugin(env: string) {
  const config = JSON.parse(
    fs.readFileSync(`../server/clientConfig/${env}.json`, "utf-8")
  );

  return {
    name: "html-transform",
    transformIndexHtml: (html: string): string => {
      return html.replace(/%(.*?)%/g, (match, p1) => config[p1] ?? match);
    },
  };
}
