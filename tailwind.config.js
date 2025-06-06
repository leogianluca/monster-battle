module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        medievalSharp: ['MedievalSharp', 'cursive'],
      },
      backgroundImage: {
        parchment: "url('/assets/parchment.svg')",
      },
    },
  },
  plugins: [],
}
