import type { Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Omit<Config, "content"> = {
  darkMode: [],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      title: ["var(--font-title)", ...fontFamily.sans],
      sans: ["var(--font-sans)", ...fontFamily.sans],
    },
    extend: {
      boxShadow: {
        retro: "4px 4px 0px var(--mix-bg)",
        "retro-lg": "8px 8px 0px var(--mix-bg)",
      },
      colors: {
        border: "color-mix(in oklab, var(--space) 10%, var(--mix-fg) 90%)",
        input: "color-mix(in oklab, var(--space) 10%, var(--mix-fg) 90%)",
        ring: "color-mix(in oklab, var(--space) 10%, var(--mix-bg) 90%)",
        background: "color-mix(in oklab, var(--space) 20%, var(--mix-fg) 80%)",
        foreground: "color-mix(in oklab, var(--space) 20%, var(--mix-bg) 80%)",
        primary: {
          DEFAULT: "var(--space)",
          foreground:
            "color-mix(in oklab, var(--space) 10%, var(--mix-fg) 90%)",
        },
        secondary: {
          DEFAULT:
            "color-mix(in oklab, var(--space) 80%, lch(from var(--space) l c calc(h + 120)) 20%)",
          foreground:
            "color-mix(in oklab, var(--secondary) 10%, var(--mix-fg) 90%)",
        },
        destructive: {
          DEFAULT: "color-mix(in oklab, var(--space) 10%, red 90%)",
          foreground:
            "color-mix(in oklab, var(--space) 10%, var(--mix-fg) 90%)",
        },
        muted: {
          DEFAULT: "color-mix(in oklab, var(--space) 30%, var(--mix-fg) 70%)",
          foreground:
            "color-mix(in oklab, var(--space) 10%, var(--mix-bg) 70%)",
        },
        accent: {
          DEFAULT: "lch(from var(--space) l c calc(h - 120))",
          foreground:
            "color-mix(in oklab, var(--accent) 10%, var(--mix-bg) 90%)",
        },
        popover: {
          DEFAULT: "color-mix(in oklab, var(--space) 10%, var(--mix-fg) 90%)",
          foreground:
            "color-mix(in oklab, var(--space) 10%, var(--mix-bg) 90%)",
        },
        card: {
          DEFAULT: "color-mix(in oklab, var(--space) 15%, var(--mix-fg) 85%)",
          foreground:
            "color-mix(in oklab, var(--space) 10%, var(--mix-bg) 90%)",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animatePlugin],
}

export default config
