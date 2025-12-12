import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    electron({
      main: {
        entry: "electron/main.ts",
      },
      preload: {
        input: {
          preload: path.join(__dirname, "electron/preload.ts"),
        },
      },
    }),
  ],
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
