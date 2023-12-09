/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: { preflight: false },
  blocklist: ['container'],
  daisyui: {
    themes: ['dim', 'dracula'],
    base: false,
  },
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}
