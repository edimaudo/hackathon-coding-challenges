export interface Country {
2  code: string;
3  name: string;
4  capital: string;
5  gdp: string;
6  pop: string;
7  beer: string;
8}
9
10export type GameMode = 'country' | 'flag' | 'capital' | 'guesser';
11
12export type Page = 'menu' | 'game' | 'settings' | 'results' | 'about';
13
14export interface GameState {
15  currentMode: GameMode | null;
16  questions: Country[];
17  currentQuestionIndex: number;
18  startTime: number;
19  penalties: number;
20  isAnswered: boolean;
21  selectedAnswer: string | null;
22  correctAnswer: string | null;
23}
24
25export interface BestTimes {
26  country: number | null;
27  flag: number | null;
28  capital: number | null;
29  guesser: number | null;
30}
31
32export interface SettingsState {
33  theme: 'light' | 'dark';
34  bestTimes: BestTimes;
35}