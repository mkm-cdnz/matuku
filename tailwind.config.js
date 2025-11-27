/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom colors if needed, but we'll stick to slate/zinc for now
            },
        },
    },
    plugins: [],
    darkMode: 'class', // Enable class-based dark mode
}
