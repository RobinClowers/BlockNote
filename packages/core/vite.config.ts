import * as path from "path";
import { webpackStats } from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";
import pkg from "./package.json";
// import eslintPlugin from "vite-plugin-eslint";

const deps = Object.keys(pkg.dependencies);

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitestSetup.ts"],
  },
  plugins: [webpackStats()],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        blocknote: path.resolve(__dirname, "src/index.ts"),
        comments: path.resolve(__dirname, "src/comments/index.ts"),
        locales: path.resolve(__dirname, "src/i18n/index.ts"),
      },
      name: "blocknote",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.js` : `${entryName}.cjs`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: (source: string) => {
        if (deps.includes(source)) {
          return true;
        }
        return (
          source.startsWith("prosemirror-") ||
          source.startsWith("@shikijs/lang") ||
          source.startsWith("@shikijs/theme")
        );
      },
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
        interop: "compat", // https://rollupjs.org/migration/#changed-defaults
      },
    },
  },
});
