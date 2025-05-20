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
    // Tailwind color classes in proper format
    'dark:text-white',
    'dark:text-gray-100',
    'dark:text-gray-200',
    'dark:text-gray-300',
    'dark:text-gray-400',
    'dark:text-gray-500',
    'dark:text-slate-100',
    'dark:text-slate-200',
    'dark:text-slate-300',
    'dark:text-slate-400',
    'dark:text-neutral-100',
    'dark:text-neutral-200',
    'dark:text-neutral-300',
    'dark:text-neutral-400',
    'dark:text-black',
    'dark:text-blue-400',
    'dark:text-blue-500',
    'dark:text-red-400',
    'dark:text-red-500',
    'dark:bg-gray-800',
    'dark:bg-gray-900',
    'dark:bg-black',
    'dark:bg-white',
    'dark:bg-slate-800',
    'dark:bg-slate-900',
    'dark:bg-neutral-800',
    'dark:bg-neutral-900',
    'dark:bg-blue-900',
    'dark:bg-blue-800',
    'dark:bg-red-900',
    'dark:bg-red-800',
    'dark:border-gray-700',
    'dark:border-gray-800',
    'dark:border-black',
    'dark:border-white',
    'dark:border-slate-700',
    'dark:border-slate-800',
    'dark:border-neutral-700',
    'dark:border-neutral-800',
    'dark:border-blue-800',
    'dark:border-blue-700'
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

