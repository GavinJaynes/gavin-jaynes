import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

export default defineConfig({
  site: "https://gavinjaynes.xyz",
  vite: {
    plugins: [tailwindcss()],
  },
})
