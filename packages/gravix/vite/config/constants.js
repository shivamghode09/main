export const DEFAULT_CONFIG = Object.freeze({
  PORT: 9174,
  OPEN_BROWSER: false,
  ENV_PREFIX: "GRAVIX_",
  FORMAT: "es",
  TARGET: "node",
  PROJECT_TYPE: "spa",
  USE_POLLING: true,
  HOT_RELOAD: true,
  ANALYZE_BUNDLE: false,
  SOURCE_MAP: true,
  RECONNECT: true,
  WATCH_SRC: true,
});

export const COLORS = Object.freeze({
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  DIM: "\x1b[2m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  INFO: "\x1b[36m",
});
