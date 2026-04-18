import { create } from 'zustand';
2import type { BestTimes } from '../types/types';
3
4interface SettingsStore {
5  theme: 'light' | 'dark';
6  bestTimes: BestTimes;
7  toggleTheme: () => void;
8  updateBestTime: (mode: keyof BestTimes, time: number) => void;
9  clearAllScores: () => void;
10  loadBestTimes: () => void;
11}
12
13const loadBestTimesFromStorage = (): BestTimes => {
14  return {
15    country: localStorage.getItem('best_time_country') 
16      ? Number.parseFloat(localStorage.getItem('best_time_country')!) 
17      : null,
18    flag: localStorage.getItem('best_time_flag') 
19      ? Number.parseFloat(localStorage.getItem('best_time_flag')!) 
20      : null,
21    capital: localStorage.getItem('best_time_capital') 
22      ? Number.parseFloat(localStorage.getItem('best_time_capital')!) 
23      : null,
24    guesser: localStorage.getItem('best_time_guesser') 
25      ? Number.parseFloat(localStorage.getItem('best_time_guesser')!) 
26      : null,
27  };
28};
29
30const loadThemeFromStorage = (): 'light' | 'dark' => {
31  const saved = localStorage.getItem('theme');
32  return (saved === 'dark' || saved === 'light') ? saved : 'light';
33};
34
35export const useSettingsStore = create<SettingsStore>((set) => ({
36  theme: loadThemeFromStorage(),
37  bestTimes: loadBestTimesFromStorage(),
38  
39  toggleTheme: () => set((state) => {
40    const newTheme = state.theme === 'light' ? 'dark' : 'light';
41    localStorage.setItem('theme', newTheme);
42    document.documentElement.classList.toggle('dark', newTheme === 'dark');
43    return { theme: newTheme };
44  }),
45  
46  updateBestTime: (mode, time) => set((state) => {
47    const currentBest = state.bestTimes[mode];
48    if (currentBest === null || time < currentBest) {
49      localStorage.setItem(`best_time_${mode}`, time.toString());
50      return {
51        bestTimes: {
52          ...state.bestTimes,
53          [mode]: time,
54        },
55      };
56    }
57    return state;
58  }),
59  
60  clearAllScores: () => set(() => {
61    localStorage.removeItem('best_time_country');
62    localStorage.removeItem('best_time_flag');
63    localStorage.removeItem('best_time_capital');
64    localStorage.removeItem('best_time_guesser');
65    return {
66      bestTimes: {
67        country: null,
68        flag: null,
69        capital: null,
70        guesser: null,
71      },
72    };
73  }),
74  
75  loadBestTimes: () => set(() => ({
76    bestTimes: loadBestTimesFromStorage(),
77  })),
78}));
79