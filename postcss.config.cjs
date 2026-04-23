// ...existing code...
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Optional: enable cssnano in production by uncommenting the next line and installing cssnano
    // ...(process.env.NODE_ENV === 'production' ? { 'cssnano': { preset: 'default' } } : {})
  }
};