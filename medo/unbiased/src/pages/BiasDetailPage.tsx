import { useEffect, useState } from 'react';
2import { useParams, useNavigate } from 'react-router-dom';
3import { Layout } from '@/components/layouts/Layout';
4import { Button } from '@/components/ui/button';
5import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
6import { Skeleton } from '@/components/ui/skeleton';
7import { Separator } from '@/components/ui/separator';
8import { ArrowLeft } from 'lucide-react';
9import { supabase } from '@/db/supabase';
10import { useApp } from '@/contexts/AppContext';
11import { t } from '@/lib/i18n';
12import { getTranslatedBias } from '@/lib/biasTranslations';
13import type { Bias } from '@/types/types';
14
15export default function BiasDetailPage() {
16  const { id } = useParams<{ id: string }>();
17  const { language } = useApp();
18  const navigate = useNavigate();
19  const [bias, setBias] = useState<Bias | null>(null);
20  const [loading, setLoading] = useState(true);
21  const [error, setError] = useState(false);
22
23  useEffect(() => {
24    async function loadBias() {
25      if (!id) return;
26
27      try {
28        setLoading(true);
29        setError(false);
30
31        const { data, error: fetchError } = await supabase
32          .from('biases')
33          .select('*')
34          .eq('id', id)
35          .maybeSingle();
36
37        if (fetchError) throw fetchError;
38
39        setBias(data);
40      } catch (err) {
41        console.error('Error loading bias:', err);
42        setError(true);
43      } finally {
44        setLoading(false);
45      }
46    }
47
48    loadBias();
49  }, [id]);
50
51  if (loading) {
52    return (
53      <Layout>
54        <div className="container px-4 py-12 max-w-4xl mx-auto">
55          <Skeleton className="h-10 w-32 mb-8 bg-muted" />
56          <Skeleton className="h-12 w-3/4 mb-4 bg-muted" />
57          <Skeleton className="h-64 w-full bg-muted" />
58        </div>
59      </Layout>
60    );
61  }
62
63  if (error || !bias) {
64    return (
65      <Layout>
66        <div className="container px-4 py-12 max-w-4xl mx-auto">
67          <Button variant="ghost" onClick={() => navigate('/bias-explorer')} className="mb-8">
68            <ArrowLeft className="mr-2 h-4 w-4" />
69            {t('bias_explorer.back', language)}
70          </Button>
71          <p className="text-muted-foreground">{t('bias_explorer.error', language)}</p>
72        </div>
73      </Layout>
74    );
75  }
76
77  const translatedBias = getTranslatedBias(bias, language);
78
79  const sections = [
80    { key: 'details', title: t('bias_explorer.sections.details', language), content: translatedBias.details },
81    { key: 'where_occurs', title: t('bias_explorer.sections.where_occurs', language), content: translatedBias.where_occurs },
82    { key: 'why_happens', title: t('bias_explorer.sections.why_happens', language), content: translatedBias.why_happens },
83    { key: 'why_matters', title: t('bias_explorer.sections.why_matters', language), content: translatedBias.why_matters },
84    { key: 'examples', title: t('bias_explorer.sections.examples', language), content: translatedBias.examples },
85    { key: 'affects_you', title: t('bias_explorer.sections.affects_you', language), content: translatedBias.affects_you },
86    { key: 'affects_business', title: t('bias_explorer.sections.affects_business', language), content: translatedBias.affects_business },
87    { key: 'how_to_avoid', title: t('bias_explorer.sections.how_to_avoid', language), content: translatedBias.how_to_avoid },
88  ];
89
90  return (
91    <Layout>
92      <div className="container px-4 py-12 max-w-4xl mx-auto">
93        <Button variant="ghost" onClick={() => navigate('/bias-explorer')} className="mb-8">
94          <ArrowLeft className="mr-2 h-4 w-4" />
95          {t('bias_explorer.back', language)}
96        </Button>
97
98        <div className="space-y-8">
99          {/* Header */}
100          <div>
101            <h1 className="text-4xl font-bold mb-4">{translatedBias.name}</h1>
102            <p className="text-xl text-muted-foreground">{translatedBias.overview}</p>
103          </div>
104
105          <Separator className="editorial-divider" />
106
107          {/* Content Sections */}
108          {sections.map((section, index) => (
109            <Card key={section.key} className="editorial-shadow">
110              <CardHeader>
111                <CardTitle className="text-2xl">{section.title}</CardTitle>
112              </CardHeader>
113              <CardContent>
114                {Array.isArray(section.content) ? (
115                  <ul className="list-disc list-inside space-y-2">
116                    {section.content.map((item, i) => (
117                      <li key={i} className="text-muted-foreground">{item}</li>
118                    ))}
119                  </ul>
120                ) : (
121                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
122                )}
123              </CardContent>
124            </Card>
125          ))}
126        </div>
127      </div>
128    </Layout>
129  );
130}
131