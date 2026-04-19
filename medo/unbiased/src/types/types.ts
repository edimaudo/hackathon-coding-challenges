export interface Bias {
2  id: string;
3  name: string;
4  overview: string;
5  details: string;
6  where_occurs: string;
7  why_happens: string;
8  why_matters: string;
9  examples: string[];
10  affects_you: string;
11  affects_business: string;
12  how_to_avoid: string;
13  translations?: Record<string, BiasTranslation>;
14  created_at?: string;
15}
16
17export interface BiasTranslation {
18  name?: string;
19  overview?: string;
20  details?: string;
21  where_occurs?: string;
22  why_happens?: string;
23  why_matters?: string;
24  examples?: string[];
25  affects_you?: string;
26  affects_business?: string;
27  how_to_avoid?: string;
28}
29
30export interface QuizQuestion {
31  id: string;
32  quiz_type: 'name_that_bias' | 'bias_checker';
33  question: string;
34  options: string[];
35  correct_answer: string;
36  translations?: Record<string, QuizQuestionTranslation>;
37  created_at?: string;
38}
39
40export interface QuizQuestionTranslation {
41  question?: string;
42  options?: string[];
43  correct_answer?: string;
44}
45
46export interface QuizResult {
47  id?: string;
48  session_id: string;
49  quiz_type: 'name_that_bias' | 'bias_checker';
50  score: number;
51  created_at?: string;
52}
53
54export interface UserPreferences {
55  id?: string;
56  session_id: string;
57  theme: 'dark' | 'light';
58  font_size: 'small' | 'medium' | 'large';
59  language: 'en' | 'fr' | 'es';
60  reminder_enabled: boolean;
61  reminder_time: string;
62  created_at?: string;
63  updated_at?: string;
64}
65
66export type QuizType = 'name_that_bias' | 'bias_checker';
67export type Theme = 'dark' | 'light';
68export type FontSize = 'small' | 'medium' | 'large';
69export type Language = 'en' | 'fr' | 'es';
70