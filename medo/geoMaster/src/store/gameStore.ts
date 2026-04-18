import { create } from 'zustand';
2import type { Country, GameMode } from '../types/types';
3import { COUNTRIES } from '../data/countries';
4import { generateQuestions, getRandomCountries, shuffleArray } from '../utils/helpers';
5
6interface GameStore {
7  currentMode: GameMode | null;
8  questions: Country[];
9  currentQuestionIndex: number;
10  options: Country[];
11  startTime: number;
12  penalties: number;
13  isAnswered: boolean;
14  selectedAnswer: string | null;
15  correctAnswer: string | null;
16  finalTime: number;
17  isNewRecord: boolean;
18  
19  startGame: (mode: GameMode) => void;
20  answerQuestion: (answerCode: string) => void;
21  nextQuestion: () => void;
22  resetGame: () => void;
23  setFinalTime: (time: number) => void;
24  setIsNewRecord: (isNew: boolean) => void;
25}
26
27export const useGameStore = create<GameStore>((set, get) => ({
28  currentMode: null,
29  questions: [],
30  currentQuestionIndex: 0,
31  options: [],
32  startTime: 0,
33  penalties: 0,
34  isAnswered: false,
35  selectedAnswer: null,
36  correctAnswer: null,
37  finalTime: 0,
38  isNewRecord: false,
39  
40  startGame: (mode) => {
41    const questions = generateQuestions(COUNTRIES, 7);
42    const correctCountry = questions[0];
43    const wrongCountries = getRandomCountries(COUNTRIES, correctCountry, 3);
44    const options = shuffleArray([correctCountry, ...wrongCountries]);
45    
46    set({
47      currentMode: mode,
48      questions,
49      currentQuestionIndex: 0,
50      options,
51      startTime: Date.now(),
52      penalties: 0,
53      isAnswered: false,
54      selectedAnswer: null,
55      correctAnswer: null,
56      finalTime: 0,
57      isNewRecord: false,
58    });
59  },
60  
61  answerQuestion: (answerCode) => {
62    const { questions, currentQuestionIndex, penalties } = get();
63    const correctCountry = questions[currentQuestionIndex];
64    const isCorrect = answerCode === correctCountry.code;
65    
66    set({
67      isAnswered: true,
68      selectedAnswer: answerCode,
69      correctAnswer: correctCountry.code,
70      penalties: isCorrect ? penalties : penalties + 60000,
71    });
72  },
73  
74  nextQuestion: () => {
75    const { questions, currentQuestionIndex } = get();
76    const nextIndex = currentQuestionIndex + 1;
77    
78    if (nextIndex < questions.length) {
79      const correctCountry = questions[nextIndex];
80      const wrongCountries = getRandomCountries(COUNTRIES, correctCountry, 3);
81      const options = shuffleArray([correctCountry, ...wrongCountries]);
82      
83      set({
84        currentQuestionIndex: nextIndex,
85        options,
86        isAnswered: false,
87        selectedAnswer: null,
88        correctAnswer: null,
89      });
90    }
91  },
92  
93  resetGame: () => {
94    set({
95      currentMode: null,
96      questions: [],
97      currentQuestionIndex: 0,
98      options: [],
99      startTime: 0,
100      penalties: 0,
101      isAnswered: false,
102      selectedAnswer: null,
103      correctAnswer: null,
104      finalTime: 0,
105      isNewRecord: false,
106    });
107  },
108  
109  setFinalTime: (time) => {
110    set({ finalTime: time });
111  },
112  
113  setIsNewRecord: (isNew) => {
114    set({ isNewRecord: isNew });
115  },
116}));
117