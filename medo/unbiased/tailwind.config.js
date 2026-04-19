mport tailwindAnimate from 'tailwindcss-animate';
2import containerQuery from '@tailwindcss/container-queries';
3import intersect from 'tailwindcss-intersect';
4
5export default {
6    darkMode: ['class'],
7    content: [
8        './index.html',
9        './pages/**/*.{ts,tsx}',
10        './components/**/*.{ts,tsx}',
11        './app/**/*.{ts,tsx}',
12        './src/**/*.{ts,tsx}',
13        './node_modules/streamdown/dist/**/*.js'
14    ],
15    safelist: ['border', 'border-border'],
16    prefix: '',
17    theme: {
18        container: {
19            center: true,
20            padding: '2rem',
21            screens: {
22                '2xl': '1400px'
23            }
24        },
25        extend: {
26            colors: {
27                border: 'hsl(var(--border))',
28                borderColor: {
29                    border: 'hsl(var(--border))'
30                },
31                input: 'hsl(var(--input))',
32                ring: 'hsl(var(--ring))',
33                background: 'hsl(var(--background))',
34                foreground: 'hsl(var(--foreground))',
35                primary: {
36                    DEFAULT: 'hsl(var(--primary))',
37                    foreground: 'hsl(var(--primary-foreground))'
38                },
39                secondary: {
40                    DEFAULT: 'hsl(var(--secondary))',
41                    foreground: 'hsl(var(--secondary-foreground))'
42                },
43                destructive: {
44                    DEFAULT: 'hsl(var(--destructive))',
45                    foreground: 'hsl(var(--destructive-foreground))'
46                },
47                muted: {
48                    DEFAULT: 'hsl(var(--muted))',
49                    foreground: 'hsl(var(--muted-foreground))'
50                },
51                accent: {
52                    DEFAULT: 'hsl(var(--accent))',
53                    foreground: 'hsl(var(--accent-foreground))'
54                },
55                popover: {
56                    DEFAULT: 'hsl(var(--popover))',
57                    foreground: 'hsl(var(--popover-foreground))'
58                },
59                card: {
60                    DEFAULT: 'hsl(var(--card))',
61                    foreground: 'hsl(var(--card-foreground))'
62                },
63                education: {
64                    blue: 'hsl(var(--education-blue))',
65                    green: 'hsl(var(--education-green))'
66                },
67                success: 'hsl(var(--success))',
68                warning: 'hsl(var(--warning))',
69                info: 'hsl(var(--info))',
70                sidebar: {
71                    DEFAULT: 'hsl(var(--sidebar-background))',
72                    background: 'hsl(var(--sidebar-background))',
73                    foreground: 'hsl(var(--sidebar-foreground))',
74                    primary: 'hsl(var(--sidebar-primary))',
75                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
76                    accent: 'hsl(var(--sidebar-accent))',
77                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
78                    border: 'hsl(var(--sidebar-border))',
79                    ring: 'hsl(var(--sidebar-ring))'
80                },
81                chart: {
82                    '1': 'hsl(var(--chart-1))',
83                    '2': 'hsl(var(--chart-2))',
84                    '3': 'hsl(var(--chart-3))',
85                    '4': 'hsl(var(--chart-4))',
86                    '5': 'hsl(var(--chart-5))'
87                }
88            },
89            borderRadius: {
90                lg: 'var(--radius)',
91                md: 'calc(var(--radius) - 2px)',
92                sm: 'calc(var(--radius) - 4px)'
93            },
94            backgroundImage: {
95                'gradient-primary': 'var(--gradient-primary)',
96                'gradient-card': 'var(--gradient-card)',
97                'gradient-background': 'var(--gradient-background)'
98            },
99            boxShadow: {
100                card: 'var(--shadow-card)',
101                hover: 'var(--shadow-hover)'
102            },
103            keyframes: {
104                'accordion-down': {
105                    from: {
106                        height: '0'
107                    },
108                    to: {
109                        height: 'var(--radix-accordion-content-height)'
110                    }
111                },
112                'accordion-up': {
113                    from: {
114                        height: 'var(--radix-accordion-content-height)'
115                    },
116                    to: {
117                        height: '0'
118                    }
119                },
120                'fade-in': {
121                    from: {
122                        opacity: '0',
123                        transform: 'translateY(10px)'
124                    },
125                    to: {
126                        opacity: '1',
127                        transform: 'translateY(0)'
128                    }
129                },
130                'slide-in': {
131                    from: {
132                        opacity: '0',
133                        transform: 'translateX(-20px)'
134                    },
135                    to: {
136                        opacity: '1',
137                        transform: 'translateX(0)'
138                    }
139                }
140            },
141            animation: {
142                'accordion-down': 'accordion-down 0.2s ease-out',
143                'accordion-up': 'accordion-up 0.2s ease-out',
144                'fade-in': 'fade-in 0.5s ease-out',
145                'slide-in': 'slide-in 0.5s ease-out'
146            }
147        }
148    },
149    plugins: [
150        tailwindAnimate,
151        containerQuery,
152        intersect,
153        function ({addUtilities}) {
154            addUtilities(
155                {
156                    '.border-t-solid': {'border-top-style': 'solid'},
157                    '.border-r-solid': {'border-right-style': 'solid'},
158                    '.border-b-solid': {'border-bottom-style': 'solid'},
159                    '.border-l-solid': {'border-left-style': 'solid'},
160                    '.border-t-dashed': {'border-top-style': 'dashed'},
161                    '.border-r-dashed': {'border-right-style': 'dashed'},
162                    '.border-b-dashed': {'border-bottom-style': 'dashed'},
163                    '.border-l-dashed': {'border-left-style': 'dashed'},
164                    '.border-t-dotted': {'border-top-style': 'dotted'},
165                    '.border-r-dotted': {'border-right-style': 'dotted'},
166                    '.border-b-dotted': {'border-bottom-style': 'dotted'},
167                    '.border-l-dotted': {'border-left-style': 'dotted'},
168                },
169                ['responsive']
170            );
171        },
172    ],
173};
174