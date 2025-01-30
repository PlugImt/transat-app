/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                border: '#27272a',
                input: '#27272a',
                ring: '#0049a8',
                background: '#0D0505',
                foreground: '#ffe6cc',
                primary: {
                    DEFAULT: '#0049a8', foreground: '#ffe6cc',
                },
                secondary: {
                    DEFAULT: '#0f172a', foreground: '#ffe6cc',
                },
                destructive: {
                    DEFAULT: '#7f1d1d', foreground: '#ffe6cc',
                },
                muted: {
                    DEFAULT: '#262626', foreground: '#a1a1aa',
                },
                accent: {
                    DEFAULT: '#ec7f32', foreground: '#ffe6cc',
                },
                popover: {
                    DEFAULT: '#1d1711', foreground: '#ffe6cc',
                },
                card: {
                    DEFAULT: '#140C0C', foreground: '#ffe6cc',
                },
            }, fontFamily: {
                pthin: ["Poppins-Thin", "sans-serif"],
                pextralight: ["Poppins-ExtraLight", "sans-serif"],
                plight: ["Poppins-Light", "sans-serif"],
                pregular: ["Poppins-Regular", "sans-serif"],
                pmedium: ["Poppins-Medium", "sans-serif"],
                psemibold: ["Poppins-SemiBold", "sans-serif"],
                pbold: ["Poppins-Bold", "sans-serif"],
                pextrabold: ["Poppins-ExtraBold", "sans-serif"],
                pblack: ["Poppins-Black", "sans-serif"],
            },
        },
    },
    plugins: [],
}