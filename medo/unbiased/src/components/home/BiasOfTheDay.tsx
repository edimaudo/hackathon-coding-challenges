import { useEffect, useState } from 'react';
2import { useNavigate } from 'react-router-dom';
3import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
4import { Skeleton } from '@/components/ui/skeleton';
5import { Button } from '@/components/ui/button';
6import { supabase } from '@/db/supabase';
7import { useApp } from '@/contexts/AppContext';
8import { t } from '@/lib/i18n';
9import { getTranslatedBias } from '@/lib/biasTranslations';
10import type { Bias } from '@/types/types';
11
12export function BiasOfTheDay() {
13  const { language } = useApp();
14  const navigate = useNavigate();
15  const [bias, setBias] = useState<Bias | null>(null);
16  const [loading, setLoading] = useState(true);
17  const [error, setError] = useState(false);
18
19  useEffect(() => {
20    async function loadBiasOfTheDay() {
21      try {
22        setLoading(true);
23        setError(false);
24
25        // Get all biases and select one based on current date
26        const { data, error: fetchError } = await supabase
27          .from('biases')
28          .select('*')
29          .order('name');
30
31        if (fetchError) throw fetchError;
32
33        if (data && data.length > 0) {
34          // Use current date to determine which bias to show
35          const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
36          const biasIndex = dayOfYear % data.length;
37          setBias(data[biasIndex]);
38        }
39      } catch (err) {
40        console.error('Error loading bias of the day:', err);
41        setError(true);
42      } finally {
43        setLoading(false);
44      }
45    }
46
47    loadBiasOfTheDay();
48  }, []);
49
50  if (loading) {
51    return (
52      <Card className="editorial-shadow smooth-transition hover:shadow-lg cursor-pointer">
53        <CardHeader>
54          <Skeleton className="h-8 w-48 bg-muted" />
55          <Skeleton className="h-4 w-full bg-muted mt-2" />
56        </CardHeader>
57        <CardContent>
58          <Skeleton className="h-20 w-full bg-muted" />
59        </CardContent>
60      </Card>
61    );
62  }
63
64  if (error || !bias) {
65    return (
66      <Card className="editorial-shadow">
67        <CardHeader>
68          <CardTitle>{t('home.bias_of_the_day', language)}</CardTitle>
69        </CardHeader>
70        <CardContent>
71          <p className="text-muted-foreground">{t('common.error', language)}</p>
72          <Button onClick={() => window.location.reload()} className="mt-4">
73            {t('common.retry', language)}
74          </Button>
75        </CardContent>
76      </Card>
77    );
78  }
79
80  const translatedBias = getTranslatedBias(bias, language);
81
82  return (
83    <Card
84      className="editorial-shadow smooth-transition hover:shadow-lg cursor-pointer"
85      onClick={() => navigate(`/bias-explorer/${bias.id}`)}
86    >
87      <CardHeader>
88        <CardTitle className="text-2xl">{t('home.bias_of_the_day', language)}</CardTitle>
89        <CardDescription className="text-lg font-semibold text-foreground">
90          {translatedBias.name}
91        </CardDescription>
92      </CardHeader>
93      <CardContent>
94        <p className="text-muted-foreground">{translatedBias.overview}</p>
95      </CardContent>
96    </Card>
97  );
98}