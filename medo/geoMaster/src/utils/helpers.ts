import type { Country } from '../types/types';
2
3export const shuffleArray = <T>(array: T[]): T[] => {
4  const shuffled = [...array];
5  for (let i = shuffled.length - 1; i > 0; i--) {
6    const j = Math.floor(Math.random() * (i + 1));
7    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
8  }
9  return shuffled;
10};
11
12export const formatTime = (milliseconds: number): string => {
13  const totalSeconds = Math.floor(milliseconds / 1000);
14  const minutes = Math.floor(totalSeconds / 60);
15  const seconds = totalSeconds % 60;
16  
17  if (minutes > 0) {
18    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
19  }
20  return `${seconds}s`;
21};
22
23export const getRandomCountries = (
24  allCountries: Country[],
25  correctCountry: Country,
26  count: number
27): Country[] => {
28  const wrongCountries = allCountries.filter(c => c.code !== correctCountry.code);
29  const shuffled = shuffleArray(wrongCountries);
30  return shuffled.slice(0, count);
31};
32
33export const generateQuestions = (allCountries: Country[], count: number): Country[] => {
34  return shuffleArray(allCountries).slice(0, count);
35};