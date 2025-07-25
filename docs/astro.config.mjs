// @ts-check
import starlight from "@astrojs/starlight"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://coat-rack.github.io",
  base: "/app/",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Coat Rack",
      social: {
        github: "https://github.com/coat-rack",
      },
      sidebar: [
        {
          label: "Welcome",
          link: "/welcome",
        },
        {
          label: "Getting Started",
          link: "/getting-started",
        },
        {
          label: "Architecture",
          link: "/architecture",
        },
        {
          label: "App Development",
          link: "/app-development",
        },
        {
          label: "Packages",
          autogenerate: {
            directory: "packages",
          },
        },
      ],
      customCss: ["./src/tailwind.css"],
      components: {
        Hero: "./src/components/Hero.astro",
        Pagination: "./src/components/Pagination.astro",
      },
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
})
