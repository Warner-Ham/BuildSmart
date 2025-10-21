/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BuildSmart Primary Green Colors
        primary: {
          50: '#e8f5e9',   // Light green background
          100: '#c8e6c9',  // Light green background 2
          200: '#a5d6a7',  // Light green background 3
          300: '#81c784',  // Medium green
          400: '#66bb6a',  // Medium-dark green
          500: '#4caf50',  // Standard green
          600: '#287a2c',  // BuildSmart primary light
          700: '#205c20',  // BuildSmart primary (main brand color)
          800: '#1b4d1b',  // Darker green
          900: '#133a13',  // BuildSmart primary dark
        },
        // BuildSmart Accent Colors
        accent: {
          50: '#f1f8e9',
          100: '#dcedc8',
          200: '#c5e1a5',
          300: '#aed581',
          400: '#9ccc65',
          500: '#a8e063',  // BuildSmart accent
          600: '#9AFE6A',  // BuildSmart accent bright
          700: '#7cb342',
          800: '#689f38',
          900: '#558b2f',
        },
        // Keep your existing primary blues as 'blue' for backward compatibility
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-left': 'fadeInLeft 0.8s ease-out',
        'fade-in-right': 'fadeInRight 0.8s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'card-slide': 'cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        cardSlideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px) scale(0.95) rotateX(15deg)'
          },
          '50%': {
            opacity: '0.7',
            transform: 'translateY(-5px) scale(1.02) rotateX(0deg)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1) rotateX(0deg)'
          },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(168, 224, 99, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(168, 224, 99, 0)' },
        },
      },
      backgroundImage: {
        'gradient-buildsmart': 'linear-gradient(135deg, #e8f5e9 70%, #c8e6c9 100%)',
        'gradient-buildsmart-dark': 'linear-gradient(135deg, #205c20 0%, #287a2c 100%)',
        'gradient-navbar': 'linear-gradient(to bottom, #287a2c 50%, #1E6821 80%, #003403 95%)',
      },
      boxShadow: {
        'buildsmart-sm': '0 2px 8px rgba(32, 92, 32, 0.08)',
        'buildsmart-md': '0 4px 16px rgba(32, 92, 32, 0.12)',
        'buildsmart-lg': '0 8px 32px rgba(32, 92, 32, 0.18)',
        'buildsmart-xl': '0 12px 48px rgba(32, 92, 32, 0.24)',
        'buildsmart-button': '3px 3px 6px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}