import { type FC, useEffect, useState } from 'react';
2import { Home, RotateCcw } from 'lucide-react';
3import { useGameStore } from '../store/gameStore';
4import { getFlagUrl } from '../data/countries';
5import { FlagOption } from './FlagOption';
6import { OptionButton } from './OptionButton';
7
8interface GameScreenProps {
9  onGameComplete: () => void;
10  onReset: () => void;
11  onHome: () => void;
12}
13
14export const GameScreen: FC<GameScreenProps> = ({ onGameComplete, onReset, onHome }) => {
15  const {
16    currentMode,
17    questions,
18    currentQuestionIndex,
19    options,
20    penalties,
21    isAnswered,
22    selectedAnswer,
23    correctAnswer,
24    answerQuestion,
25    nextQuestion,
26  } = useGameStore();
27
28  const [elapsedTime, setElapsedTime] = useState(0);
29  const startTime = useGameStore((state) => state.startTime);
30
31  useEffect(() => {
32    const interval = setInterval(() => {
33      setElapsedTime(Date.now() - startTime);
34    }, 100);
35
36    return () => clearInterval(interval);
37  }, [startTime]);
38
39  useEffect(() => {
40    if (isAnswered) {
41      const timeout = setTimeout(() => {
42        if (currentQuestionIndex < questions.length - 1) {
43          nextQuestion();
44        } else {
45          onGameComplete();
46        }
47      }, 2000);
48
49      return () => clearTimeout(timeout);
50    }
51  }, [isAnswered, currentQuestionIndex, questions.length, nextQuestion, onGameComplete]);
52
53  if (!currentMode || questions.length === 0) {
54    return null;
55  }
56
57  const currentCountry = questions[currentQuestionIndex];
58  const totalPenaltySeconds = Math.floor(penalties / 1000);
59
60  const getModeName = () => {
61    switch (currentMode) {
62      case 'country':
63        return 'Country Mode';
64      case 'flag':
65        return 'Flag Mode';
66      case 'capital':
67        return 'Capital Mode';
68      case 'guesser':
69        return 'Guesser Mode';
70      default:
71        return '';
72    }
73  };
74
75  const handleAnswer = (code: string) => {
76    if (!isAnswered) {
77      answerQuestion(code);
78    }
79  };
80
81  const renderQuestion = () => {
82    switch (currentMode) {
83      case 'country':
84        return (
85          <div className="space-y-4">
86            <div className="text-center space-y-2">
87              <h2 className="font-pixel text-xl md:text-2xl text-pixel-text">
88                {currentCountry.name}
89              </h2>
90              <p className="font-pixel text-[10px] text-pixel-textMuted">
91                Select the correct flag
92              </p>
93            </div>
94            <div className="grid grid-cols-2 gap-3">
95              {options.map((option) => (
96                <FlagOption
97                  key={option.code}
98                  countryCode={option.code}
99                  countryName={option.name}
100                  onClick={() => handleAnswer(option.code)}
101                  isSelected={selectedAnswer === option.code}
102                  isCorrect={correctAnswer === option.code}
103                  showFeedback={isAnswered}
104                  disabled={isAnswered}
105                />
106              ))}
107            </div>
108          </div>
109        );
110
111      case 'flag':
112        return (
113          <div className="space-y-4">
114            <div className="flex flex-col items-center space-y-2">
115              <div className="w-full max-w-xs aspect-[3/2] border-4 border-pixel-text shadow-pixel overflow-hidden">
116                <img
117                  src={getFlagUrl(currentCountry.code)}
118                  alt="Flag"
119                  className="w-full h-full object-cover"
120                />
121              </div>
122              <p className="font-pixel text-[10px] text-pixel-textMuted">
123                Which country is this?
124              </p>
125            </div>
126            <div className="space-y-2">
127              {options.map((option) => (
128                <OptionButton
129                  key={option.code}
130                  label={option.name}
131                  onClick={() => handleAnswer(option.code)}
132                  isSelected={selectedAnswer === option.code}
133                  isCorrect={correctAnswer === option.code}
134                  showFeedback={isAnswered}
135                  disabled={isAnswered}
136                />
137              ))}
138            </div>
139          </div>
140        );
141
142      case 'capital':
143        return (
144          <div className="space-y-4">
145            <div className="text-center space-y-2">
146              <h2 className="font-pixel text-xl md:text-2xl text-pixel-text">
147                {currentCountry.capital}
148              </h2>
149              <p className="font-pixel text-[10px] text-pixel-textMuted">
150                Select the country for this capital
151              </p>
152            </div>
153            <div className="grid grid-cols-2 gap-3">
154              {options.map((option) => (
155                <FlagOption
156                  key={option.code}
157                  countryCode={option.code}
158                  countryName={option.name}
159                  onClick={() => handleAnswer(option.code)}
160                  isSelected={selectedAnswer === option.code}
161                  isCorrect={correctAnswer === option.code}
162                  showFeedback={isAnswered}
163                  disabled={isAnswered}
164                />
165              ))}
166            </div>
167          </div>
168        );
169
170      case 'guesser':
171        return (
172          <div className="space-y-4">
173            <div className="pixel-card p-4 space-y-2">
174              <h3 className="font-pixel text-xs text-pixel-accent">
175                Mystery Country
176              </h3>
177              <div className="font-pixel text-[10px] text-pixel-text space-y-1">
178                <p>Population: {currentCountry.pop}</p>
179                <p>GDP: {currentCountry.gdp}</p>
180                <p>Capital: {currentCountry.capital}</p>
181                <p>Beer/Year: {currentCountry.beer}</p>
182              </div>
183            </div>
184            <div className="space-y-2">
185              {options.map((option) => (
186                <OptionButton
187                  key={option.code}
188                  label={option.name}
189                  onClick={() => handleAnswer(option.code)}
190                  isSelected={selectedAnswer === option.code}
191                  isCorrect={correctAnswer === option.code}
192                  showFeedback={isAnswered}
193                  disabled={isAnswered}
194                />
195              ))}
196            </div>
197          </div>
198        );
199
200      default:
201        return null;
202    }
203  };
204
205  return (
206    <div className="min-h-screen bg-pixel-bg flex flex-col p-4">
207      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
208        {/* Header with mode title */}
209        <header className="text-center mb-8 mt-4">
210          <h1 className="font-pixel text-lg text-pixel-text mb-8">
211            {getModeName()}
212          </h1>
213          <div className="flex justify-between items-center font-pixel text-[10px]">
214            <span className="text-pixel-text" aria-live="polite">
215              Question {currentQuestionIndex + 1} of 7
216            </span>
217            <span className="text-pixel-error" aria-live="polite" aria-atomic="true">
218              Penalty: {totalPenaltySeconds} seconds
219            </span>
220          </div>
221        </header>
222
223        {/* Question content */}
224        <main className="flex-1 flex items-center justify-center" role="main" aria-label="Quiz question">
225          <div className="w-full space-y-4">
226            {renderQuestion()}
227
228            {isAnswered && (
229              <div className="text-center py-4" role="status" aria-live="assertive" aria-atomic="true">
230                <p
231                  className={`font-pixel text-base md:text-lg ${
232                    selectedAnswer === correctAnswer
233                      ? 'text-pixel-success'
234                      : 'text-pixel-error'
235                  }`}
236                >
237                  {selectedAnswer === correctAnswer ? 'Correct!' : 'Wrong! Plus 60 seconds penalty'}
238                </p>
239              </div>
240            )}
241          </div>
242        </main>
243
244        {/* Control buttons */}
245        <nav className="mt-4 mb-4 flex gap-2" aria-label="Game controls">
246          <button
247            type="button"
248            onClick={onReset}
249            aria-label="Reset game with new questions"
250            className="flex-1 pixel-button bg-pixel-secondary hover:bg-pixel-accent flex items-center justify-center gap-2"
251          >
252            <RotateCcw className="w-4 h-4" aria-hidden="true" />
253            <span>Reset</span>
254          </button>
255          <button
256            type="button"
257            onClick={onHome}
258            aria-label="Return to main menu"
259            className="flex-1 pixel-button bg-pixel-primary hover:bg-pixel-secondary flex items-center justify-center gap-2"
260          >
261            <Home className="w-4 h-4" aria-hidden="true" />
262            <span>Home</span>
263          </button>
264        </nav>
265      </div>
266    </div>
267  );
268};