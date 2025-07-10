module.exports = {
    darkMode: 'class',
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
            animation: {
                fadeInUp: 'fadeInUp 0.5s ease-out forwards',
                fadeIn: 'fadeIn 0.4s ease-out forwards',
            },
        },
    },
    plugins: [],
}