import { useEffect, useState } from 'react';
2import { useNavigate } from 'react-router-dom';
3import { Layout } from '@/components/layouts/Layout';
4import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
5import { Skeleton } from '@/components/ui/skeleton';
6import { Button } from '@/components/ui/button';
7import { supabase } from '@/db/supabase';
8import { useApp } from '@/contexts/AppContext';
9import { t } from '@/lib/i18n';
10import { getTranslatedBias } from '@/lib/biasTranslations';
11import type { Bias } from '@/types/types';
12
13export default function BiasListPage() {
14  const { language } = useApp();
15  const navigate = useNavigate();
16  const [biases, setBiases] = useState<Bias[]>([]);
17  const [loading, setLoading] = useState(true);
18  const [error, setError] = useState(false);
19
20  useEffect(() => {
21    async function loadBiases() {
22      try {
23        setLoading(true);
24        setError(false);
25
26        const { data, error: fetchError } = await supabase
27          .from('biases')
28          .select('*')
29          .order('name');
30
31        if (fetchError) throw fetchError;
32
33        setBiases(data || []);
34      } catch (err) {
35        console.error('Error loading biases:', err);
36        setError(true);
37      } finally {
38        setLoading(false);
39      }
40    }
41
42    loadBiases();
43  }, []);
44
45  return (
46    <Layout>
47      <div className="container px-4 py-12 max-w-7xl mx-auto">
48        <div className="mb-8">
49          <h1 className="text-4xl font-bold mb-2">{t('bias_explorer.title', language)}</h1>
50          <p className="text-muted-foreground">{t('bias_explorer.all_biases', language)}</p>
51        </div>
52
53        {loading && (
54          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
55            {Array.from({ length: 9 }).map((_, i) => (
56              <Card key={i} className="editorial-shadow">
57                <CardHeader>
58                  <Skeleton className="h-6 w-3/4 bg-muted" />
59                </CardHeader>
60                <CardContent>
61                  <Skeleton className="h-16 w-full bg-muted" />
62                </CardContent>
63              </Card>
64            ))}
65          </div>
66        )}
67
68        {error && (
69          <div className="text-center py-12">
70            <p className="text-muted-foreground mb-4">{t('bias_explorer.error', language)}</p>
71            <Button onClick={() => window.location.reload()}>
72              {t('bias_explorer.retry', language)}
73            </Button>
74          </div>
75        )}
76
77        {!loading && !error && (
78          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
79            {biases.map((bias) => {
80              const translatedBias = getTranslatedBias(bias, language);
81              return (
82                <Card
83                  key={bias.id}
84                  className="editorial-shadow smooth-transition hover:shadow-lg cursor-pointer"
85                  onClick={() => navigate(`/bias-explorer/${bias.id}`)}
86                >
87                  <CardHeader>
88                    <CardTitle className="text-lg">{translatedBias.name}</CardTitle>
89                  </CardHeader>
90                  <CardContent>
91                    <CardDescription className="line-clamp-3">{translatedBias.overview}</CardDescription>
92                  </CardContent>
93                </Card>
94              );
95            })}
96          </div>
97        )}
98      </div>
99    </Layout>
100  );
101}
102