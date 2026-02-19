/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'bounce-short': 'bounce 1s infinite',
                fadeIn: 'fadeIn 0.5s ease-out forwards',
                slideUp: 'slideUp 0.5s ease-out forwards',
                zoomIn: 'zoomIn 0.3s ease-out forwards',
            },
            keyframes: {
                bounce: {
                    '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
                    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
                },
                fadeIn: {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' },
                },
                slideUp: {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                zoomIn: {
                    'from': { transform: 'scale(0.95)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
