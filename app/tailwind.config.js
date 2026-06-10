/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        brand: {
          green: "#009B40",
          "green-dark": "#008F3A",
          "green-bright": "#00B050",
          "green-mid": "#006B30",
          charcoal: "#333333",
          body: "#333333",
          black: "#000000",
          headline: "#000000",
          muted: "#858585",
          placeholder: "#A9A9A9",
          background: "#EAEAEA",
          "background-alt": "#EEEEEE",
          white: "#FFFFFF",
          error: "#FF5252",
          purple: "#924FFF",
          yellow: "#F7A21B",
        },
        sage: {
          50: "#F7F9F7",
          100: "#F2F5F2",
          200: "#EFF2EF",
          300: "#EBEEEB",
          400: "#D4DED4",
        },
        success: "#009B40",
        warning: "#F7A21B",
      },
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['58px', { lineHeight: '1.04', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-lg': ['48px', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-md': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-sm': ['22px', { lineHeight: '1.18', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['20px', { lineHeight: '1.4', fontWeight: '400' }],
        'body-md': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'micro': ['11px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      spacing: {
        'section': '80px',
        'section-tablet': '60px',
        'section-mobile': '48px',
      },
      maxWidth: {
        'content': '1248px',
        'content-xl': '1600px',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
