/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        theme: {
          page: 'var(--theme-page)',
          header: 'var(--theme-header)',
          card: 'var(--theme-card)',
          'card-hover': 'var(--theme-card-hover)',
          input: 'var(--theme-input)',
          primary: 'var(--theme-primary)',
          secondary: 'var(--theme-secondary)',
          muted: 'var(--theme-muted)',
          border: 'var(--theme-border)',
          'border-strong': 'var(--theme-border-strong)',
        },
      },
      animation: {
        'scan-light': 'scanLight 3s ease-in-out infinite',
        'pulse-scale': 'pulseScale 2s ease-in-out infinite',
        'bounce-card': 'bounceCard 1.5s ease-in-out infinite',
        'shake-card': 'shakeCard 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
      },
      keyframes: {
        scanLight: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        bounceCard: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-6px)' },
          '50%': { transform: 'translateY(-3px)' },
          '75%': { transform: 'translateY(-1px)' },
        },
        shakeCard: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '20%': { transform: 'translateX(-2px) rotate(-0.5deg)' },
          '40%': { transform: 'translateX(2px) rotate(0.5deg)' },
          '60%': { transform: 'translateX(-2px) rotate(-0.5deg)' },
          '80%': { transform: 'translateX(2px) rotate(0.5deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
