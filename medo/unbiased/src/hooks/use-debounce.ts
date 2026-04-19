1import * as React from "react";
2
3export function useDebounce<T>(value: T, delay?: number): T {
4  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
5
6  React.useEffect(() => {
7    const timer = setTimeout(() => setDebouncedValue(value), delay ?? 500);
8
9    return () => {
10      clearTimeout(timer);
11    };
12  }, [value, delay]);
13
14  return debouncedValue;
15}