import type { FC } from 'react';
2
3interface OptionButtonProps {
4  label: string;
5  onClick: () => void;
6  isSelected: boolean;
7  isCorrect: boolean;
8  showFeedback: boolean;
9  disabled: boolean;
10}
11
12export const OptionButton: FC<OptionButtonProps> = ({
13  label,
14  onClick,
15  isSelected,
16  isCorrect,
17  showFeedback,
18  disabled,
19}) => {
20  const getButtonClass = () => {
21    if (!showFeedback) {
22      return 'bg-pixel-primary text-white border-pixel-text';
23    }
24    if (isCorrect) {
25      return 'bg-pixel-success text-white border-pixel-success';
26    }
27    if (isSelected && !isCorrect) {
28      return 'bg-pixel-error text-white border-pixel-error';
29    }
30    return 'bg-pixel-primary text-white border-pixel-text';
31  };
32
33  const getAriaLabel = () => {
34    let ariaLabel = label;
35    if (showFeedback) {
36      if (isCorrect) {
37        ariaLabel += ', correct answer';
38      } else if (isSelected) {
39        ariaLabel += ', incorrect answer';
40      }
41    }
42    return ariaLabel;
43  };
44
45  return (
46    <button
47      type="button"
48      onClick={onClick}
49      disabled={disabled}
50      aria-label={getAriaLabel()}
51      aria-pressed={isSelected}
52      className={`
53        w-full font-pixel text-xs px-4 py-3 border-4 shadow-pixel
54        transition-all active:translate-x-1 active:translate-y-1 active:shadow-none
55        disabled:cursor-not-allowed
56        focus-visible:ring-4 focus-visible:ring-pixel-accent focus-visible:ring-offset-2
57        ${getButtonClass()}
58      `}
59    >
60      {label}
61    </button>
62  );
63};
64