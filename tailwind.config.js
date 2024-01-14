/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#1d4ed8",
          "secondary": "#93c5fd",
          "accent": "#bfdbfe",
          "neutral": "#dbeafe",
          "base-100": "#f3f4f6",
          "base-200": "#e5e7eb",
          "base-300": "#d1d5dd",
          // "base-300": "#dbeafe",
          // "base-300": "#e8f2ff",
          "info": "#2563eb",
          "success": "#22c55e",
          "warning": "#facc15",
          "error": "#dc2626",
          "default": "#e8f2ff",

          "--rounded-box": "0.8rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.8rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs

          ".bg-default-1": {
            "background-color": "#f3f4f6"
          },
          ".bg-default-2": {
            "background-color": "#e5e7eb"
          },
          ".bg-default-3": {
            "background-color": "#d1d5db"
          },
          ".bg-default-4": {
            "background-color": "#b1b7c0"
          }
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary": "#1d4ed8",
          "secondary": "#93c5fd",
          // "accent": "#bfdbfe",
          "accent": "#1a1a2f",
          // "neutral": "#dbeafe",
          "neutral": "#151931",
          // "base-300": "#000304",
          // "base-200": "#111315",
          // "base-100": "#22242A",
          "info": "#2563eb",
          "success": "#22c55e",
          "warning": "#facc15",
          "warning-inverse": "#facc1530",
          "error": "#dc2626",
          "error-inverse": "#dc262640",

          "--rounded-box": "0.8rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.8rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
        }
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}

