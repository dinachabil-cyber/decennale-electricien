module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#38BDF8',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#FB923C',
        danger: '#EF4444',
        dark: '#0F172A',
        light: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceHover: '#F1F5F9',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 1s ease-out',
        'slide-in-right': 'slideInRight 1s ease-out',
        'fade-in': 'fadeIn 1s ease-in',
        'bounce': 'bounce 2s infinite',
        'pulse-custom': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
