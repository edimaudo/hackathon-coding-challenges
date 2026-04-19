import type { Bias, Language } from '@/types/types';
2
3export function getTranslatedBiasField(
4  bias: Bias,
5  field: keyof Omit<Bias, 'id' | 'created_at' | 'translations'>,
6  language: Language
7): string | string[] {
8  // If language is English, return the original field
9  if (language === 'en') {
10    return bias[field] as string | string[];
11  }
12
13  // Check if translations exist for this language
14  const translation = bias.translations?.[language];
15  
16  if (translation && field in translation) {
17    const translatedValue = translation[field as keyof typeof translation];
18    if (translatedValue !== undefined && translatedValue !== null) {
19      return translatedValue as string | string[];
20    }
21  }
22
23  // Fallback to English
24  return bias[field] as string | string[];
25}
26
27export function getTranslatedBias(bias: Bias, language: Language): Bias {
28  if (language === 'en' || !bias.translations?.[language]) {
29    return bias;
30  }
31
32  const translation = bias.translations[language];
33  
34  return {
35    ...bias,
36    name: (translation.name || bias.name) as string,
37    overview: (translation.overview || bias.overview) as string,
38    details: (translation.details || bias.details) as string,
39    where_occurs: (translation.where_occurs || bias.where_occurs) as string,
40    why_happens: (translation.why_happens || bias.why_happens) as string,
41    why_matters: (translation.why_matters || bias.why_matters) as string,
42    examples: (translation.examples || bias.examples) as string[],
43    affects_you: (translation.affects_you || bias.affects_you) as string,
44    affects_business: (translation.affects_business || bias.affects_business) as string,
45    how_to_avoid: (translation.how_to_avoid || bias.how_to_avoid) as string,
46  };
47}