import tailwindAnimate from 'tailwindcss-animate';
2
3export default {
4    darkMode: 'class',
5    content: [
6        './index.html',
7        './pages/**/*.{ts,tsx}',
8        './components/**/*.{ts,tsx}',
9        './app/**/*.{ts,tsx}',
10        './src/**/*.{ts,tsx}',
11        './node_modules/streamdown/dist/**/*.js'
12    ],
13    prefix: '',
14    theme: {
15        extend: {
16            colors: {
17                border: 'hsl(var(--border))',
18                pixel: {
19                    bg: 'var(--pixel-bg)',
20                    surface: 'var(--pixel-surface)',
21                    primary: 'var(--pixel-primary)',
22                    secondary: 'var(--pixel-secondary)',
23                    accent: 'var(--pixel-accent)',
24                    text: 'var(--pixel-text)',
25                    textMuted: 'var(--pixel-text-muted)',
26                    success: 'var(--pixel-success)',
27                    error: 'var(--pixel-error)',
28                    warning: 'var(--pixel-warning)',
29                },
30            },
31            fontFamily: {
32                pixel: ['"Press Start 2P"', 'cursive'],
33            },
34            boxShadow: {
35                pixel: '4px 4px 0px 0px rgba(0, 0, 0, 0.25)',
36                'pixel-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.25)',
37                'pixel-lg': '6px 6px 0px 0px rgba(0, 0, 0, 0.25)',
38            },
39        }
40    },
41    plugins: [tailwindAnimate]
42};