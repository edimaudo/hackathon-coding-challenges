import type { FC } from 'react';
2import { Trophy, Home } from 'lucide-react';
3import { useGameStore } from '../store/gameStore';
4import { formatTime } from '../utils/helpers';
5
6interface ResultsScreenProps {
7  onBackToMenu: () => void;
8}
9
10export const ResultsScreen: FC<ResultsScreenProps> = ({ onBackToMenu }) => {
11  const { finalTime, isNewRecord } = useGameStore();
12
13  const totalSeconds = finalTime / 1000;
14
15  return (
16    <div className="min-h-screen bg-pixel-bg flex items-center justify-center p-4">
17      <div className="w-full max-w-md space-y-6">
18        <header className="text-center space-y-4">
19          <h1 className="font-pixel text-2xl text-pixel-text">
20            Finished!
21          </h1>
22
23          <div className="pixel-card p-6 space-y-4">
24            <div className="space-y-2">
25              <p className="font-pixel text-[10px] text-pixel-textMuted">
26                FINAL TIME
27              </p>
28              <p className="font-pixel text-3xl text-pixel-accent" aria-label={`Final time: ${totalSeconds.toFixed(2)} seconds`}>
29                {totalSeconds.toFixed(2)}s
30              </p>
31            </div>
32
33            {isNewRecord && (
34              <div 
35                className="flex items-center justify-center gap-2 bg-pixel-warning/20 border-4 border-pixel-warning p-3"
36                role="status"
37                aria-live="polite"
38              >
39                <Trophy className="w-5 h-5 text-pixel-warning" aria-hidden="true" />
40                <span className="font-pixel text-[10px] text-pixel-warning">
41                  New Personal Best!
42                </span>
43              </div>
44            )}
45          </div>
46        </header>
47
48        <button
49          type="button"
50          onClick={onBackToMenu}
51          aria-label="Return to main menu"
52          className="w-full pixel-button bg-pixel-primary hover:bg-pixel-secondary flex items-center justify-center gap-2"
53        >
54          <Home className="w-4 h-4" aria-hidden="true" />
55          <span>Back to Menu</span>
56        </button>
57      </div>
58    </div>
59  );
60};