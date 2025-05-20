/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}"
  ],
  safelist: [
    // Ensure dark prose styles are preserved
    'dark:prose-invert',
    // Ensure specific colors that match our custom CSS
    'dark:text-white',
    'dark:text-f5f5f5',
    'dark:text-e5e5e5',
    'dark:text-a3a3a3',
    'dark:text-3b82f6',
    'dark:text-60a5fa',
    'dark:text-93c5fd',
    'dark:text-d4d4d4',
    'dark:text-bbb',
    'dark:text-e0e0e0',
    'dark:border-zinc-700',
    'dark:border-neutral-700',
    'dark:border-gray-700',
    'dark:border-slate-700'
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Add exact colors from our custom CSS to make them available as utilities
        f5f5f5: "#f5f5f5",
        e5e5e5: "#e5e5e5",
        a3a3a3: "#a3a3a3",
        bbb: "#bbb",
        e0e0e0: "#e0e0e0",
        "60a5fa": "#60a5fa",
        "93c5fd": "#93c5fd",
        "3b82f6": "#3b82f6",
        d4d4d4: "#d4d4d4",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

