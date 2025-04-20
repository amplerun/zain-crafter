module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          light: '#FF8E8E',
          dark: '#E05555',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          light: '#7EDDD6',
          dark: '#3AAFA8',
        },
        accent: {
          DEFAULT: '#FFE66D',
          light: '#FFF08C',
          dark: '#F5D547',
        },
      },
    },
  },
  plugins: [],
}
