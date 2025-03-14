import starlightPlugin from "@astrojs/starlight-tailwind"
import sharedConfig from "@repo/tailwind-config"
import type { Config } from "tailwindcss"

// Generated color palettes from https://starlight.astro.build/guides/css-and-tailwind/#color-theme-editor
const accent = {
  200: "#feb3a6",
  600: "#a60a00",
  900: "#640300",
  950: "#460b05",
}
const gray = {
  100: "#f9f5f5",
  200: "#f3ecea",
  300: "#c8c0be",
  400: "#978784",
  500: "#635451",
  700: "#423432",
  800: "#302321",
  900: "#1d1715",
}

const config: Config = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "../packages/ui/src/**/*.tsx",
  ],
  presets: [sharedConfig],
  plugins: [starlightPlugin()],
  theme: {
    extend: {
      colors: {
        accent,
        gray,
      },
      fontFamily: {
        sans: "Pixelify Sans",
        mono: "Pixelify Sans",
      },
    },
  },
}
export default config
