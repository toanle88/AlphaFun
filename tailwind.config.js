/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dark: 'var(--accent-dark)',
        },
        bg: 'var(--bg-color)',
        card: 'var(--card-bg)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
      },
      borderRadius: {
        '3xl': '30px',
      },
      boxShadow: {
        'neo': 'var(--shadow-depth) var(--shadow-depth) 0px rgba(0, 0, 0, 0.1)',
        'neo-inset': 'inset 0 0 20px rgba(0, 0, 0, 0.05)',
      },
      borderWidth: {
        '4': '4px',
      },
      fontFamily: {
        main: ['Fredoka', 'Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
