import type { Country } from '../types/types';
2
3export const COUNTRIES: Country[] = [
4  // North America
5  { code: 'ca', name: 'Canada', capital: 'Ottawa', gdp: '$2.38 trillion', pop: '38.9 million', beer: '57 liters' },
6  { code: 'us', name: 'United States', capital: 'Washington, D.C.', gdp: '$25.46 trillion', pop: '333.3 million', beer: '73 liters' },
7  { code: 'mx', name: 'Mexico', capital: 'Mexico City', gdp: '$1.41 trillion', pop: '126.7 million', beer: '68 liters' },
8  
9  // South America
10  { code: 'br', name: 'Brazil', capital: 'Brasília', gdp: '$1.92 trillion', pop: '214.3 million', beer: '60 liters' },
11  { code: 'ar', name: 'Argentina', capital: 'Buenos Aires', gdp: '$632 billion', pop: '45.8 million', beer: '41 liters' },
12  { code: 'co', name: 'Colombia', capital: 'Bogotá', gdp: '$343 billion', pop: '51.8 million', beer: '44 liters' },
13  { code: 'cl', name: 'Chile', capital: 'Santiago', gdp: '$300 billion', pop: '19.6 million', beer: '45 liters' },
14  { code: 'pe', name: 'Peru', capital: 'Lima', gdp: '$242 billion', pop: '34.0 million', beer: '45 liters' },
15  { code: 'uy', name: 'Uruguay', capital: 'Montevideo', gdp: '$71 billion', pop: '3.4 million', beer: '30 liters' },
16
17  // Europe
18  { code: 'gb', name: 'United Kingdom', capital: 'London', gdp: '$3.07 trillion', pop: '67.0 million', beer: '70 liters' },
19  { code: 'fr', name: 'France', capital: 'Paris', gdp: '$2.78 trillion', pop: '67.8 million', beer: '33 liters' },
20  { code: 'de', name: 'Germany', capital: 'Berlin', gdp: '$4.07 trillion', pop: '83.2 million', beer: '92 liters' },
21  { code: 'it', name: 'Italy', capital: 'Rome', gdp: '$2.01 trillion', pop: '59.1 million', beer: '31 liters' },
22  { code: 'es', name: 'Spain', capital: 'Madrid', gdp: '$1.40 trillion', pop: '47.4 million', beer: '50 liters' },
23  { code: 'se', name: 'Sweden', capital: 'Stockholm', gdp: '$585 billion', pop: '10.4 million', beer: '50 liters' },
24  { code: 'cz', name: 'Czechia', capital: 'Prague', gdp: '$290 billion', pop: '10.5 million', beer: '140 liters' },
25  { code: 'ie', name: 'Ireland', capital: 'Dublin', gdp: '$529 billion', pop: '5.0 million', beer: '95 liters' },
26  { code: 'be', name: 'Belgium', capital: 'Brussels', gdp: '$578 billion', pop: '11.6 million', beer: '65 liters' },
27  { code: 'nl', name: 'Netherlands', capital: 'Amsterdam', gdp: '$991 billion', pop: '17.5 million', beer: '69 liters' },
28  { code: 'ch', name: 'Switzerland', capital: 'Bern', gdp: '$807 billion', pop: '8.7 million', beer: '55 liters' },
29  { code: 'ru', name: 'Russia', capital: 'Moscow', gdp: '$2.24 trillion', pop: '143.4 million', beer: '58 liters' },
30  { code: 'pl', name: 'Poland', capital: 'Warsaw', gdp: '$688 billion', pop: '38.0 million', beer: '97 liters' },
31  { code: 'at', name: 'Austria', capital: 'Vienna', gdp: '$471 billion', pop: '9.0 million', beer: '103 liters' },
32  { code: 'gr', name: 'Greece', capital: 'Athens', gdp: '$218 billion', pop: '10.4 million', beer: '28 liters' },
33  { code: 'pt', name: 'Portugal', capital: 'Lisbon', gdp: '$253 billion', pop: '10.3 million', beer: '51 liters' },
34  { code: 'dk', name: 'Denmark', capital: 'Copenhagen', gdp: '$395 billion', pop: '5.9 million', beer: '60 liters' },
35  { code: 'fi', name: 'Finland', capital: 'Helsinki', gdp: '$281 billion', pop: '5.5 million', beer: '74 liters' },
36  { code: 'no', name: 'Norway', capital: 'Oslo', gdp: '$579 billion', pop: '5.4 million', beer: '55 liters' },
37  { code: 'hu', name: 'Hungary', capital: 'Budapest', gdp: '$178 billion', pop: '9.6 million', beer: '73 liters' },
38  { code: 'ro', name: 'Romania', capital: 'Bucharest', gdp: '$301 billion', pop: '19.0 million', beer: '78 liters' },
39
40  // Asia
41  { code: 'jp', name: 'Japan', capital: 'Tokyo', gdp: '$4.23 trillion', pop: '124.6 million', beer: '38 liters' },
42  { code: 'in', name: 'India', capital: 'New Delhi', gdp: '$3.41 trillion', pop: '1.41 billion', beer: '2 liters' },
43  { code: 'cn', name: 'China', capital: 'Beijing', gdp: '$17.96 trillion', pop: '1.41 billion', beer: '29 liters' },
44  { code: 'kr', name: 'South Korea', capital: 'Seoul', gdp: '$1.67 trillion', pop: '51.7 million', beer: '39 liters' },
45  { code: 'id', name: 'Indonesia', capital: 'Jakarta', gdp: '$1.31 trillion', pop: '275.5 million', beer: '1 liter' },
46  { code: 'th', name: 'Thailand', capital: 'Bangkok', gdp: '$495 billion', pop: '71.6 million', beer: '27 liters' },
47  { code: 'vn', name: 'Vietnam', capital: 'Hanoi', gdp: '$408 billion', pop: '98.1 million', beer: '43 liters' },
48  { code: 'ph', name: 'Philippines', capital: 'Manila', gdp: '$404 billion', pop: '115.5 million', beer: '19 liters' },
49  { code: 'my', name: 'Malaysia', capital: 'Kuala Lumpur', gdp: '$406 billion', pop: '33.9 million', beer: '11 liters' },
50  { code: 'sa', name: 'Saudi Arabia', capital: 'Riyadh', gdp: '$1.10 trillion', pop: '36.4 million', beer: '0 liters' },
51  { code: 'tr', name: 'Turkey', capital: 'Ankara', gdp: '$905 billion', pop: '85.3 million', beer: '13 liters' },
52  { code: 'il', name: 'Israel', capital: 'Jerusalem', gdp: '$522 billion', pop: '9.3 million', beer: '14 liters' },
53  { code: 'pk', name: 'Pakistan', capital: 'Islamabad', gdp: '$348 billion', pop: '235.8 million', beer: '0.1 liters' },
54  { code: 'sg', name: 'Singapore', capital: 'Singapore', gdp: '$466 billion', pop: '5.6 million', beer: '20 liters' },
55
56  // Africa
57  { code: 'za', name: 'South Africa', capital: 'Pretoria', gdp: '$405 billion', pop: '59.3 million', beer: '60 liters' },
58  { code: 'ng', name: 'Nigeria', capital: 'Abuja', gdp: '$477 billion', pop: '213.4 million', beer: '12 liters' },
59  { code: 'eg', name: 'Egypt', capital: 'Cairo', gdp: '$476 billion', pop: '109.3 million', beer: '0.2 liters' },
60  { code: 'ke', name: 'Kenya', capital: 'Nairobi', gdp: '$113 billion', pop: '54.0 million', beer: '12 liters' },
61  { code: 'et', name: 'Ethiopia', capital: 'Addis Ababa', gdp: '$126 billion', pop: '123.3 million', beer: '4 liters' },
62  { code: 'ma', name: 'Morocco', capital: 'Rabat', gdp: '$134 billion', pop: '37.4 million', beer: '1 liter' },
63  { code: 'dz', name: 'Algeria', capital: 'Algiers', gdp: '$191 billion', pop: '44.9 million', beer: '1 liter' },
64  { code: 'gh', name: 'Ghana', capital: 'Accra', gdp: '$72 billion', pop: '33.4 million', beer: '10 liters' },
65  { code: 'tz', name: 'Tanzania', capital: 'Dodoma', gdp: '$75 billion', pop: '65.4 million', beer: '8 liters' },
66
67  // Oceania
68  { code: 'au', name: 'Australia', capital: 'Canberra', gdp: '$1.69 trillion', pop: '25.7 million', beer: '71 liters' },
69  { code: 'nz', name: 'New Zealand', capital: 'Wellington', gdp: '$248 billion', pop: '5.1 million', beer: '61 liters' },
70  { code: 'fj', name: 'Fiji', capital: 'Suva', gdp: '$5 billion', pop: '0.9 million', beer: '30 liters' }
71];
72
73export const getFlagUrl = (code: string): string => {
74  return `https://flagcdn.com/w320/${code}.png`;
75};
76