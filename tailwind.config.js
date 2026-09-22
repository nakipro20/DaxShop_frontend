/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-surface": "#1a1c1a",
        "primary-container": "#de2263",
        "on-primary-container": "#fffbff",
        "primary": "#b8004c",
        "on-primary": "#ffffff",
        "secondary-container": "#fe7b25",
        "on-secondary-container": "#5f2600",
        "secondary": "#9d4300",
        "on-secondary": "#ffffff",
        "surface": "#faf9f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f3f1",
        "surface-container": "#efeeeb",
        "surface-container-high": "#e9e8e5",
        "surface-container-highest": "#e3e2e0",
        "on-surface-variant": "#5a4044",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "error": "#ba1a1a",
      },
      spacing: {
        "gutter": "1.25rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
      },
      fontFamily: {
        // En un proyecto real tendrías que importar estas fuentes en el index.css
        "body-sm": ["Rubik", "sans-serif"],
        "body-md": ["Rubik", "sans-serif"],
        "body-lg": ["Rubik", "sans-serif"],
        "label-md": ["Rubik", "sans-serif"],
        "label-lg": ["Rubik", "sans-serif"],
        "headline-sm": ["Bricolage Grotesque", "sans-serif"],
        "headline-md": ["Bricolage Grotesque", "sans-serif"],
        "headline-lg": ["Bricolage Grotesque", "sans-serif"],
        "display": ["Bricolage Grotesque", "sans-serif"],
      }
    },
  },
  plugins: [],
}