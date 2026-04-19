import { clsx, type ClassValue } from "clsx"
2import { twMerge } from "tailwind-merge"
3
4export function cn(...inputs: ClassValue[]) {
5  return twMerge(clsx(inputs));
6}
7
8export type Params = Partial<
9  Record<keyof URLSearchParams, string | number | null | undefined>
10>;
11
12export function createQueryString(
13  params: Params,
14  searchParams: URLSearchParams
15) {
16  const newSearchParams = new URLSearchParams(searchParams?.toString());
17
18  for (const [key, value] of Object.entries(params)) {
19    if (value === null || value === undefined) {
20      newSearchParams.delete(key);
21    } else {
22      newSearchParams.set(key, String(value));
23    }
24  }
25
26  return newSearchParams.toString();
27}
28
29export function formatDate(
30  date: Date | string | number,
31  opts: Intl.DateTimeFormatOptions = {}
32) {
33  return new Intl.DateTimeFormat("zh-CN", {
34    month: opts.month ?? "long",
35    day: opts.day ?? "numeric",
36    year: opts.year ?? "numeric",
37    ...opts,
38  }).format(new Date(date));
39}
40