module.exports = {
  mode: 'jit',
  purge: ['src/index.html'],
  darkMode: false, // or 'media' or 'class'
  corePlugins = {
    preflight: false
  },
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
