export default {
  // config options
  clearScreen: false,
  esbuild: {
    legalComments: "none",
  },
  build: {
    target: "esnext",
  },
  server: {
    fs: {
      strict: false,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.spec.ts"],
    threads: false,
    coverage: {
      include: ['src/**'],
      provider: "istanbul",
      enabled: true,
      reporter: ["text", "json-summary", "json", "html"],
      reportOnFailure: true,
      reportsDirectory: './unit/coverage'
    },
  },
};
