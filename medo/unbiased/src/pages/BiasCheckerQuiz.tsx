import { useEffect, useState } from 'react';
2import { useNavigate } from 'react-router-dom';
3import { Layout } from '@/components/layouts/Layout';
4import { Button } from '@/components/ui/button';
5import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
6import { Skeleton } from '@/components/ui/skeleton';
7import { ArrowLeft } from 'lucide-react';
8import { supabase } from '@/db/supabase';
9import { useApp } from '@/contexts/AppContext';
10import { t } from '@/lib/i18n';
11import type { QuizQuestion, QuizResult } from '@/types/types';
12
13export default function BiasCheckerQuiz() {
14  const { language, sessionId } = useApp();
15  const navigate = useNavigate();
16  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
17  const [currentIndex, setCurrentIndex] = useState(0);
18  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
19  const [showFeedback, setShowFeedback] = useState(false);
20  const [score, setScore] = useState(0);
21  const [loading, setLoading] = useState(true);
22  const [showResults, setShowResults] = useState(false);
23
24  useEffect(() => {
25    async function loadQuiz() {
26      try {
27        setLoading(true);
28
29        const { data, error: fetchError } = await supabase
30          .from('quiz_questions')
31          .select('*')
32          .eq('quiz_type', 'bias_checker');
33
34        if (fetchError) throw fetchError;
35
36        // Shuffle and take 10 questions
37        const shuffled = (data || []).sort(() => Math.random() - 0.5).slice(0, 10);
38        setQuestions(shuffled);
39      } catch (err) {
40        console.error('Error loading quiz:', err);
41      } finally {
42        setLoading(false);
43      }
44    }
45
46    loadQuiz();
47  }, []);
48
49  const handleAnswerSelect = (answer: string) => {
50    if (showFeedback) return;
51
52    setSelectedAnswer(answer);
53    setShowFeedback(true);
54
55    if (answer === questions[currentIndex].correct_answer) {
56      setScore(score + 1);
57    }
58  };
59
60  const handleNext = () => {
61    if (currentIndex < questions.length - 1) {
62      setCurrentIndex(currentIndex + 1);
63      setSelectedAnswer(null);
64      setShowFeedback(false);
65    } else {
66      finishQuiz();
67    }
68  };
69
70  const finishQuiz = async () => {
71    const result: Omit<QuizResult, 'id' | 'created_at'> = {
72      session_id: sessionId,
73      quiz_type: 'bias_checker',
74      score,
75    };
76
77    await supabase.from('quiz_results').insert(result);
78    setShowResults(true);
79  };
80
81  if (loading) {
82    return (
83      <Layout>
84        <div className="container px-4 py-12 max-w-3xl mx-auto">
85          <Skeleton className="h-8 w-48 mb-8 bg-muted" />
86          <Card className="editorial-shadow">
87            <CardHeader>
88              <Skeleton className="h-6 w-full bg-muted" />
89            </CardHeader>
90            <CardContent>
91              <div className="space-y-3">
92                {Array.from({ length: 3 }).map((_, i) => (
93                  <Skeleton key={i} className="h-12 w-full bg-muted" />
94                ))}
95              </div>
96            </CardContent>
97          </Card>
98        </div>
99      </Layout>
100    );
101  }
102
103  if (showResults) {
104    return (
105      <Layout>
106        <div className="container px-4 py-12 max-w-3xl mx-auto">
107          <Card className="editorial-shadow">
108            <CardHeader>
109              <CardTitle className="text-3xl text-center">
110                {t('bias_detector.results_title', language)}
111              </CardTitle>
112            </CardHeader>
113            <CardContent className="text-center space-y-6">
114              <div>
115                <p className="text-lg text-muted-foreground mb-2">
116                  {t('bias_detector.your_score', language)}
117                </p>
118                <p className="text-5xl font-bold text-primary">
119                  {t('bias_detector.out_of', language, { score: score.toString(), total: '10' })}
120                </p>
121              </div>
122              <div className="flex gap-4 justify-center">
123                <Button onClick={() => window.location.reload()}>
124                  {t('bias_detector.restart', language)}
125                </Button>
126                <Button variant="outline" onClick={() => navigate('/bias-detector')}>
127                  {t('bias_detector.back_to_selection', language)}
128                </Button>
129              </div>
130            </CardContent>
131          </Card>
132        </div>
133      </Layout>
134    );
135  }
136
137  if (questions.length === 0) {
138    return (
139      <Layout>
140        <div className="container px-4 py-12 max-w-3xl mx-auto">
141          <p className="text-muted-foreground">{t('bias_detector.error', language)}</p>
142        </div>
143      </Layout>
144    );
145  }
146
147  const currentQuestion = questions[currentIndex];
148
149  return (
150    <Layout>
151      <div className="container px-4 py-12 max-w-3xl mx-auto">
152        <Button 
153          variant="ghost" 
154          onClick={() => navigate('/bias-detector')} 
155          className="mb-6"
156        >
157          <ArrowLeft className="mr-2 h-4 w-4" />
158          {t('bias_detector.back_to_selection', language)}
159        </Button>
160
161        <div className="mb-8">
162          <h1 className="text-3xl font-bold mb-2">{t('bias_detector.bias_checker', language)}</h1>
163          <p className="text-muted-foreground">
164            {t('bias_detector.question_progress', language, {
165              current: (currentIndex + 1).toString(),
166              total: questions.length.toString(),
167            })}
168          </p>
169        </div>
170
171        <Card className="editorial-shadow">
172          <CardHeader>
173            <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
174          </CardHeader>
175          <CardContent className="space-y-3">
176            {currentQuestion.options.map((option, index) => {
177              const isSelected = selectedAnswer === option;
178              const isCorrect = option === currentQuestion.correct_answer;
179              const showCorrect = showFeedback && isCorrect;
180              const showIncorrect = showFeedback && isSelected && !isCorrect;
181
182              return (
183                <Button
184                  key={index}
185                  variant="outline"
186                  className={`w-full justify-start text-left h-auto py-4 px-6 ${
187                    showCorrect ? 'answer-correct' : ''
188                  } ${showIncorrect ? 'answer-incorrect' : ''}`}
189                  onClick={() => handleAnswerSelect(option)}
190                  disabled={showFeedback}
191                >
192                  {option}
193                </Button>
194              );
195            })}
196
197            {showFeedback && (
198              <div className="pt-4">
199                <Button onClick={handleNext} className="w-full">
200                  {currentIndex < questions.length - 1
201                    ? t('bias_detector.next', language)
202                    : t('bias_detector.finish', language)}
203                </Button>
204              </div>
205            )}
206          </CardContent>
207        </Card>
208      </div>
209    </Layout>
210  );
211}