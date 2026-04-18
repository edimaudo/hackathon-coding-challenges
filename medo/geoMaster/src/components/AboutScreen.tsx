import type { FC } from 'react';
2import { ArrowLeft, Globe, Flag, MapPin, Search } from 'lucide-react';
3
4interface AboutScreenProps {
5  onBack: () => void;
6}
7
8export const AboutScreen: FC<AboutScreenProps> = ({ onBack }) => {
9  const gameModes = [
10    {
11      icon: Globe,
12      title: 'Country Mode',
13      description: 'Test your ability to match country names with their flags. You will be shown a country name and must select the correct flag from four options.',
14    },
15    {
16      icon: Flag,
17      title: 'Flag Mode',
18      description: 'Identify countries from their flags. A flag will be displayed and you must choose the correct country name from four options.',
19    },
20    {
21      icon: MapPin,
22      title: 'Capital Mode',
23      description: 'Match capital cities with their country flags. You will see a capital city name and must select the flag of the country it belongs to.',
24    },
25    {
26      icon: Search,
27      title: 'Guesser Mode',
28      description: 'Use multiple clues to identify countries. You will be given facts including population, GDP, capital city, and beer consumption to deduce the correct country.',
29    },
30  ];
31
32  return (
33    <div className="min-h-screen bg-pixel-bg flex items-center justify-center p-4">
34      <article className="w-full max-w-2xl space-y-6">
35        <header className="text-center space-y-2">
36          <h1 className="font-pixel text-2xl text-pixel-text">
37            About
38          </h1>
39        </header>
40
41        <section className="pixel-card p-4 space-y-3" aria-labelledby="about-description">
42          <div className="font-pixel text-[10px] text-pixel-text space-y-2">
43            <p>
44              geoMaster is a time-based geography quiz game that tests your knowledge of countries, flags, capitals, and world facts with 4 exciting modes.
45            </p>
46            <p>
47              Each game session consists of 7 questions. Your goal is to answer as quickly as possible with the lowest time. Incorrect answers add a 60-second penalty to your total time.
48            </p>
49            <p>
50              Your personal best time for each mode is saved and can be viewed in the Settings screen.
51            </p>
52          </div>
53        </section>
54
55        <section className="space-y-3" aria-labelledby="game-modes-heading">
56          <h2 id="game-modes-heading" className="font-pixel text-xs text-pixel-accent text-center">
57            GAME MODES
58          </h2>
59          {gameModes.map((mode) => {
60            const Icon = mode.icon;
61            return (
62              <article key={mode.title} className="pixel-card p-4 space-y-2">
63                <header className="flex items-center gap-2">
64                  <Icon className="w-4 h-4 text-pixel-accent" aria-hidden="true" />
65                  <h3 className="font-pixel text-xs text-pixel-text">
66                    {mode.title}
67                  </h3>
68                </header>
69                <p className="font-pixel text-[10px] text-pixel-textMuted leading-relaxed">
70                  {mode.description}
71                </p>
72              </article>
73            );
74          })}
75        </section>
76
77        <button
78          type="button"
79          onClick={onBack}
80          aria-label="Return to main menu"
81          className="w-full pixel-button bg-pixel-primary hover:bg-pixel-secondary flex items-center justify-center gap-2"
82        >
83          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
84          <span>Back</span>
85        </button>
86      </article>
87    </div>
88  );
89};
90