import type { FC } from 'react';
2import { getFlagUrl } from '../data/countries';
3
4interface FlagOptionProps {
5  countryCode: string;
6  countryName: string;
7  onClick: () => void;
8  isSelected: boolean;
9  isCorrect: boolean;
10  showFeedback: boolean;
11  disabled: boolean;
12}
13
14export const FlagOption: FC<FlagOptionProps> = ({
15  countryCode,
16  countryName,
17  onClick,
18  isSelected,
19  isCorrect,
20  showFeedback,
21  disabled,
22}) => {
23  const getBorderColor = () => {
24    if (!showFeedback) return 'border-pixel-text';
25    if (isCorrect) return 'border-pixel-success';
26    if (isSelected && !isCorrect) return 'border-pixel-error';
27    return 'border-pixel-text';
28  };
29
30  const getBackgroundColor = () => {
31    if (!showFeedback) return 'bg-pixel-surface';
32    if (isCorrect) return 'bg-pixel-success/20';
33    if (isSelected && !isCorrect) return 'bg-pixel-error/20';
34    return 'bg-pixel-surface';
35  };
36
37  const getAriaLabel = () => {
38    let label = `Flag of ${countryName}`;
39    if (showFeedback) {
40      if (isCorrect) {
41        label += ', correct answer';
42      } else if (isSelected) {
43        label += ', incorrect answer';
44      }
45    }
46    return label;
47  };
48
49  return (
50    <button
51      type="button"
52      onClick={onClick}
53      disabled={disabled}
54      aria-label={getAriaLabel()}
55      aria-pressed={isSelected}
56      className={`
57        relative border-4 ${getBorderColor()} ${getBackgroundColor()}
58        shadow-pixel-sm transition-all overflow-hidden
59        active:translate-x-1 active:translate-y-1 active:shadow-none
60        disabled:cursor-not-allowed
61        focus-visible:ring-4 focus-visible:ring-pixel-accent focus-visible:ring-offset-2
62        w-full aspect-[3/2]
63      `}
64    >
65      <img
66        src={getFlagUrl(countryCode)}
67        alt=""
68        role="presentation"
69        className="w-full h-full object-cover"
70        loading="lazy"
71      />
72      {showFeedback && isCorrect && (
73        <div className="absolute inset-0 bg-pixel-success/30 flex items-center justify-center" aria-hidden="true">
74          <span className="font-pixel text-white text-xs drop-shadow-lg">✓</span>
75        </div>
76      )}
77      {showFeedback && isSelected && !isCorrect && (
78        <div className="absolute inset-0 bg-pixel-error/30 flex items-center justify-center" aria-hidden="true">
79          <span className="font-pixel text-white text-xs drop-shadow-lg">✗</span>
80        </div>
81      )}
82    </button>
83  );
84};
85