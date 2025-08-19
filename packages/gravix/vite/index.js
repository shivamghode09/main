import path from "path";
import { defineConfig } from "vite";
import { DEFAULT_CONFIG } from "./config/constants.js";
import { generateAliases } from "./utils/aliases.js";
import { initWatcher } from "./config/watcher.js";
import { createCustomLogger } from "./config/logger.js";
import { withBundleAnalyzer } from "./plugins/bundleAnalyzer.js";

export function createGravixConfig(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  initWatcher(config, generateAliases);
  const initialAliases = generateAliases();

  const viteConfig = {
    server: {
      port: config.PORT,
      open: config.OPEN_BROWSER,
      watch: {
        usePolling: config.USE_POLLING,
        ignored: ["!**/src/**"],
      },
      hmr: config.HOT_RELOAD && {
        overlay: true,
        reload: true,
      },
    },
    envPrefix: config.ENV_PREFIX,
    resolve: {
      alias: initialAliases,
    },
    optimizeDeps: {
      entries: ["./src/main.js"],
      force: false,
    },
    build: {
      cssCodeSplit: true,
      sourcemap: config.SOURCE_MAP,
      rollupOptions: {
        output: {
          manualChunks: (id) => (id.includes("node_modules") ? "vendor" : null),
        },
      },
    },
    appType: config.PROJECT_TYPE,
    customLogger: createCustomLogger(),
    plugins: config.HOT_RELOAD
      ? [
          {
            name: "gravix-alias-watcher",
            configResolved(resolvedConfig) {
              if (resolvedConfig.mode === "development") {
                import("chokidar").then((chokidar) => {
                  chokidar
                    .watch(path.resolve(process.cwd(), "gravix.config.js"))
                    .on("change", () => {
                      logInfo(
                        "gravix.config.js changed, please restart server for full changes to take effect"
                      );
                    });
                });
              }
            },
          },
        ]
      : [],
  };

  return defineConfig(
    config.ANALYZE_BUNDLE ? withBundleAnalyzer(viteConfig) : viteConfig
  );
}
