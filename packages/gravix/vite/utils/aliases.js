import path from "path";
import fs from "fs";
import { logError } from "../config/logger.js";

let aliasesCache = null;
let lastAliasesUpdate = 0;

export const generateAliases = (forceUpdate = false) => {
  const now = Date.now();
  const srcPath = path.resolve(process.cwd(), "./src");

  if (aliasesCache && !forceUpdate && now - lastAliasesUpdate < 1000) {
    return aliasesCache;
  }

  const baseAliases = {
    "@": srcPath,
    "@public": path.resolve(process.cwd(), "./public"),
  };

  try {
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });
    for (const dirent of entries) {
      if (dirent.isDirectory()) {
        baseAliases[`@${dirent.name}`] = path.resolve(srcPath, dirent.name);
      }
    }

    aliasesCache = baseAliases;
    lastAliasesUpdate = now;
  } catch (err) {
    logError("Could not generate dynamic aliases");
    return aliasesCache || baseAliases;
  }

  return aliasesCache;
};
