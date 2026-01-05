import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/", // essencial para deploy
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true, // equivale a 0.0.0.0 / ::
    port: 5173, // padrão Vite (não conflita)
  },

  preview: {
    host: true,
    port: 10000, // porta padrão do Render
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    target: "esnext",
  },
}));
