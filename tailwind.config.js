// filepath: c:\Users\wali7\OneDrive\Desktop\apps\hotel-system\tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Adjust paths based on your project structure
    ],
    theme: {
        extend: {
            colors: {
                'primary-light': 'var(--primary-light)',
                'primary-light-text': 'var(--primary-light-text)',
                'primary-dark': 'var(--primary-dark)',
                'primary-dark-text': 'var(--primary-dark-text)',
            },
        },
    },
    plugins: [],
};