import { type FC, useState, useEffect } from 'react';
2import { MainMenu } from './components/MainMenu';
3import { GameScreen } from './components/GameScreen';
4import { ResultsScreen } from './components/ResultsScreen';
5import { SettingsScreen } from './components/SettingsScreen';
6import { AboutScreen } from './components/AboutScreen';
7import { useGameStore } from './store/gameStore';
8import { useSettingsStore } from './store/settingsStore';
9import type { GameMode, Page } from './types/types';
10
11const App: FC = () => {
12  const [currentPage, setCurrentPage] = useState<Page>('menu');
13  const { startGame, startTime, penalties, setFinalTime, setIsNewRecord, resetGame, currentMode } = useGameStore();
14  const { updateBestTime, bestTimes, loadBestTimes } = useSettingsStore();
15
16  useEffect(() => {
17    loadBestTimes();
18    const savedTheme = localStorage.getItem('theme');
19    if (savedTheme === 'dark') {
20      document.documentElement.classList.add('dark');
21    }
22  }, [loadBestTimes]);
23
24  const handleStartGame = (mode: GameMode) => {
25    startGame(mode);
26    setCurrentPage('game');
27  };
28
29  const handleGameComplete = () => {
30    const finalTimeMs = Date.now() - startTime + penalties;
31    const finalTimeSec = finalTimeMs / 1000;
32    setFinalTime(finalTimeMs);
33
34    if (currentMode) {
35      const currentBest = bestTimes[currentMode];
36      if (currentBest === null || finalTimeSec < currentBest) {
37        updateBestTime(currentMode, finalTimeSec);
38        setIsNewRecord(true);
39      } else {
40        setIsNewRecord(false);
41      }
42    }
43
44    setCurrentPage('results');
45  };
46
47  const handleReset = () => {
48    if (currentMode) {
49      startGame(currentMode);
50    }
51  };
52
53  const handleHomeFromGame = () => {
54    resetGame();
55    setCurrentPage('menu');
56  };
57
58  const handleBackToMenu = () => {
59    resetGame();
60    setCurrentPage('menu');
61  };
62
63  const handleOpenSettings = () => {
64    setCurrentPage('settings');
65  };
66
67  const handleOpenAbout = () => {
68    setCurrentPage('about');
69  };
70
71  const handleBackFromSettings = () => {
72    setCurrentPage('menu');
73  };
74
75  const handleBackFromAbout = () => {
76    setCurrentPage('menu');
77  };
78
79  return (
80    <div className="w-full h-full">
81      <a href="#main-content" className="skip-link font-pixel text-xs">
82        Skip to main content
83      </a>
84      {currentPage === 'menu' && (
85        <main id="main-content">
86          <MainMenu 
87            onStartGame={handleStartGame} 
88            onOpenSettings={handleOpenSettings}
89            onOpenAbout={handleOpenAbout}
90          />
91        </main>
92      )}
93      {currentPage === 'game' && (
94        <GameScreen 
95          onGameComplete={handleGameComplete}
96          onReset={handleReset}
97          onHome={handleHomeFromGame}
98        />
99      )}
100      {currentPage === 'results' && (
101        <main id="main-content">
102          <ResultsScreen onBackToMenu={handleBackToMenu} />
103        </main>
104      )}
105      {currentPage === 'settings' && (
106        <main id="main-content">
107          <SettingsScreen onBack={handleBackFromSettings} />
108        </main>
109      )}
110      {currentPage === 'about' && (
111        <main id="main-content">
112          <AboutScreen onBack={handleBackFromAbout} />
113        </main>
114      )}
115    </div>
116  );
117};
118
119export default App;
120