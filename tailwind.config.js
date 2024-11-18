module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        'primary': 'var(--primary-color)',
      },
      backgroundColor: {
        'primary': 'var(--primary-color)',
      },
      borderColor: {
        'primary': 'var(--primary-color)',
      },
    },
  },
  plugins: [],
}