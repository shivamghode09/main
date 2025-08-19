export const withBundleAnalyzer = (config) => {
  const { visualizer } = require("rollup-plugin-visualizer");
  return {
    ...config,
    plugins: [
      ...config.plugins,
      visualizer({
        open: true,
        filename: "./bundle-stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  };
};
