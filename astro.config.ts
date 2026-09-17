import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

export default defineConfig({
  site: "https://gavinjaynes.xyz",
  // Static output on Netlify: the resume and mode routes are small enough to
  // fetch as soon as a link scrolls into view, so the click is instant.
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  vite: {
    plugins: [tailwindcss()],
  },
})
