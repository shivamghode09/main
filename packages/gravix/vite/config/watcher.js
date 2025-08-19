import chokidar from "chokidar";
import path from "path";
import { logInfo } from "./logger.js";

let watcher = null;

export const initWatcher = (config, aliasesGenerator) => {
  if (!config.WATCH_SRC || watcher) return;

  const srcPath = path.resolve(process.cwd(), "./src");
  watcher = chokidar.watch(srcPath, {
    ignoreInitial: true,
    depth: 1,
    persistent: false,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  });

  const handleDirChange = (path) => {
    logInfo(`Directory change detected: ${path}`);
    aliasesGenerator(true);
    logInfo("Aliases updated automatically");
    logInfo("Please restart the server...");
    process.exit(1);
  };

  watcher.on("addDir", handleDirChange).on("unlinkDir", handleDirChange);
};
