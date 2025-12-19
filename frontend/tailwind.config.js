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
                    DEFAULT: '#1A2B4C',
                    light: '#2C3E5C',
                    dark: '#0F1A2E'
                },
                gold: {
                    DEFAULT: '#C9A227',
                    light: '#D4B347',
                    dark: '#A68616'
                },
                accent: '#DC2626'
            },
            fontFamily: {
                serif: ['Georgia', 'serif'],
                sans: ['Inter', 'sans-serif']
            }
        },
    },
    plugins: [],
}
