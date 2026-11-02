import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// VITE_BASE lets the same build deploy to pixelify.me/ (root) or a subpath.
// The default keeps the existing GitHub Pages deployment working.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE || "/portfolio_OS/",
});
