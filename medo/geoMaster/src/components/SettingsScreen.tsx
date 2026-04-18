import { type FC, useState } from 'react';
2import { Moon, Sun, Trash2, ArrowLeft } from 'lucide-react';
3import { useSettingsStore } from '../store/settingsStore';
4
5interface SettingsScreenProps {
6  onBack: () => void;
7}
8
9export const SettingsScreen: FC<SettingsScreenProps> = ({ onBack }) => {
10  const { theme, bestTimes, toggleTheme, clearAllScores } = useSettingsStore();
11  const [showConfirm, setShowConfirm] = useState(false);
12
13  const handleClearScores = () => {
14    clearAllScores();
15    setShowConfirm(false);
16  };
17
18  return (
19    <div className="min-h-screen bg-pixel-bg flex items-center justify-center p-4">
20      <div className="w-full max-w-md space-y-6">
21        <header className="text-center">
22          <h1 className="font-pixel text-2xl text-pixel-text">
23            Settings
24          </h1>
25        </header>
26
27        <main className="pixel-card p-4 space-y-4">
28          <section className="space-y-2">
29            <h2 className="font-pixel text-xs text-pixel-textMuted">
30              THEME
31            </h2>
32            <button
33              type="button"
34              onClick={toggleTheme}
35              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
36              aria-pressed={theme === 'dark'}
37              className="w-full pixel-button bg-pixel-secondary hover:bg-pixel-accent flex items-center justify-center gap-2"
38            >
39              {theme === 'light' ? (
40                <>
41                  <Moon className="w-4 h-4" aria-hidden="true" />
42                  <span>Dark Mode</span>
43                </>
44              ) : (
45                <>
46                  <Sun className="w-4 h-4" aria-hidden="true" />
47                  <span>Light Mode</span>
48                </>
49              )}
50            </button>
51          </section>
52
53          <section className="space-y-2">
54            <h2 className="font-pixel text-xs text-pixel-textMuted">
55              HIGH SCORES
56            </h2>
57            <div className="space-y-1 font-pixel text-[10px] text-pixel-text" role="list" aria-label="Personal best times">
58              <div className="flex justify-between" role="listitem">
59                <span>Country Mode:</span>
60                <span aria-label={bestTimes.country ? `${bestTimes.country.toFixed(2)} seconds` : 'No score yet'}>
61                  {bestTimes.country ? `${bestTimes.country.toFixed(2)}s` : '--'}
62                </span>
63              </div>
64              <div className="flex justify-between" role="listitem">
65                <span>Flag Mode:</span>
66                <span aria-label={bestTimes.flag ? `${bestTimes.flag.toFixed(2)} seconds` : 'No score yet'}>
67                  {bestTimes.flag ? `${bestTimes.flag.toFixed(2)}s` : '--'}
68                </span>
69              </div>
70              <div className="flex justify-between" role="listitem">
71                <span>Capital Mode:</span>
72                <span aria-label={bestTimes.capital ? `${bestTimes.capital.toFixed(2)} seconds` : 'No score yet'}>
73                  {bestTimes.capital ? `${bestTimes.capital.toFixed(2)}s` : '--'}
74                </span>
75              </div>
76              <div className="flex justify-between" role="listitem">
77                <span>Guesser Mode:</span>
78                <span aria-label={bestTimes.guesser ? `${bestTimes.guesser.toFixed(2)} seconds` : 'No score yet'}>
79                  {bestTimes.guesser ? `${bestTimes.guesser.toFixed(2)}s` : '--'}
80                </span>
81              </div>
82            </div>
83          </section>
84
85          {!showConfirm ? (
86            <button
87              type="button"
88              onClick={() => setShowConfirm(true)}
89              aria-label="Clear all high scores"
90              className="w-full pixel-button bg-pixel-error hover:bg-pixel-error/80 flex items-center justify-center gap-2"
91            >
92              <Trash2 className="w-4 h-4" aria-hidden="true" />
93              <span>Clear All Scores</span>
94            </button>
95          ) : (
96            <div className="space-y-2" role="alertdialog" aria-labelledby="confirm-clear" aria-describedby="confirm-message">
97              <p id="confirm-message" className="font-pixel text-[10px] text-pixel-error text-center">
98                Are you sure?
99              </p>
100              <div className="flex gap-2">
101                <button
102                  type="button"
103                  onClick={handleClearScores}
104                  aria-label="Yes, clear all scores"
105                  className="flex-1 pixel-button bg-pixel-error hover:bg-pixel-error/80 text-xs"
106                >
107                  Yes
108                </button>
109                <button
110                  type="button"
111                  onClick={() => setShowConfirm(false)}
112                  aria-label="No, keep scores"
113                  className="flex-1 pixel-button bg-pixel-primary hover:bg-pixel-secondary text-xs"
114                >
115                  No
116                </button>
117              </div>
118            </div>
119          )}
120        </main>
121
122        <button
123          type="button"
124          onClick={onBack}
125          aria-label="Return to main menu"
126          className="w-full pixel-button bg-pixel-primary hover:bg-pixel-secondary flex items-center justify-center gap-2"
127        >
128          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
129          <span>Back</span>
130        </button>
131      </div>
132    </div>
133  );
134};
135