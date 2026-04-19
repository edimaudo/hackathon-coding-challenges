export interface Option {
2  label: string;
3  value: string;
4  icon?: React.ComponentType<{ className?: string }>;
5  withCount?: boolean;
6}
7