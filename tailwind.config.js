/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs",
    "./views/acc/*.ejs",
    "./views/articles/*.ejs",
    "./views/home/*.ejs",
    ".public/styles/*.css"

  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss'),
  require('autoprefixer')],
}
