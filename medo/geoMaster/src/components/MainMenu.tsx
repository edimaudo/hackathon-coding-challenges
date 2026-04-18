mport type { FC } from 'react';
2import { Globe, Flag, MapPin, Search, Settings, Info } from 'lucide-react';
3import { useGameStore } from '../store/gameStore';
4import type { GameMode } from '../types/types';
5
6interface MainMenuProps {
7  onStartGame: (mode: GameMode) => void;
8  onOpenSettings: () => void;
9  onOpenAbout: () => void;
10}
11
12export const MainMenu: FC<MainMenuProps> = ({ onStartGame, onOpenSettings, onOpenAbout }) => {
13  const modes = [
14    { id: 'country' as GameMode, label: 'Country Mode', icon: Globe, desc: 'Name → Flag' },
15    { id: 'flag' as GameMode, label: 'Flag Mode', icon: Flag, desc: 'Flag → Name' },
16    { id: 'capital' as GameMode, label: 'Capital Mode', icon: MapPin, desc: 'Capital → Flag' },
17    { id: 'guesser' as GameMode, label: 'Guesser Mode', icon: Search, desc: 'Facts → Name' },
18  ];
19
20  return (
21    <div className="min-h-screen bg-pixel-bg flex items-center justify-center p-4">
22      <div className="w-full max-w-md space-y-6">
23        <header className="text-center space-y-2">
24          <h1 className="font-pixel text-2xl md:text-3xl text-pixel-text">
25            geoMaster
26          </h1>
27          <p className="font-pixel text-[10px] text-pixel-textMuted">
28            Prove Your Worldly Knowledge
29          </p>
30        </header>
31
32        <nav aria-label="Game modes" className="space-y-3">
33          {modes.map((mode) => {
34            const Icon = mode.icon;
35            
36            return (
37              <button
38                key={mode.id}
39                type="button"
40                onClick={() => onStartGame(mode.id)}
41                aria-label={`Start ${mode.label}: ${mode.desc}`}
42                className="w-full pixel-button flex items-center justify-between group hover:bg-pixel-secondary"
43              >
44                <div className="flex items-center gap-3">
45                  <Icon className="w-4 h-4" aria-hidden="true" />
46                  <div className="text-left">
47                    <div className="text-xs">{mode.label}</div>
48                    <div className="text-[10px] opacity-75">{mode.desc}</div>
49                  </div>
50                </div>
51              </button>
52            );
53          })}
54        </nav>
55
56        <nav aria-label="Additional options" className="flex gap-2">
57          <button
58            type="button"
59            onClick={onOpenAbout}
60            aria-label="View information about geoMaster"
61            className="flex-1 pixel-button bg-pixel-accent hover:bg-pixel-warning flex items-center justify-center gap-2"
62          >
63            <Info className="w-4 h-4" aria-hidden="true" />
64            <span>About</span>
65          </button>
66          <button
67            type="button"
68            onClick={onOpenSettings}
69            aria-label="Open settings and view high scores"
70            className="flex-1 pixel-button bg-pixel-secondary hover:bg-pixel-accent flex items-center justify-center gap-2"
71          >
72            <Settings className="w-4 h-4" aria-hidden="true" />
73            <span>Settings</span>
74          </button>
75        </nav>
76      </div>
77    </div>
78  );
79};
80