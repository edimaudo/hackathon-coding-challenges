import { useNavigate } from 'react-router-dom';
2import { Layout } from '@/components/layouts/Layout';
3import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
4import { Brain, CheckCircle } from 'lucide-react';
5import { useApp } from '@/contexts/AppContext';
6import { t } from '@/lib/i18n';
7
8export default function QuizSelectionPage() {
9  const { language } = useApp();
10  const navigate = useNavigate();
11
12  const quizzes = [
13    {
14      type: 'name_that_bias',
15      title: t('bias_detector.name_that_bias', language),
16      description: t('bias_detector.name_that_bias_desc', language),
17      icon: Brain,
18      path: '/bias-detector/name-that-bias',
19    },
20    {
21      type: 'bias_checker',
22      title: t('bias_detector.bias_checker', language),
23      description: t('bias_detector.bias_checker_desc', language),
24      icon: CheckCircle,
25      path: '/bias-detector/bias-checker',
26    },
27  ];
28
29  return (
30    <Layout>
31      <div className="container px-4 py-12 max-w-4xl mx-auto">
32        <div className="mb-8">
33          <h1 className="text-4xl font-bold mb-2">{t('bias_detector.title', language)}</h1>
34          <p className="text-muted-foreground">{t('bias_detector.select_quiz', language)}</p>
35        </div>
36
37        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
38          {quizzes.map((quiz) => {
39            const Icon = quiz.icon;
40            return (
41              <Card
42                key={quiz.type}
43                className="editorial-shadow smooth-transition hover:shadow-lg cursor-pointer"
44                onClick={() => navigate(quiz.path)}
45              >
46                <CardHeader>
47                  <div className="flex items-center gap-3 mb-2">
48                    <Icon className="h-8 w-8 text-primary" />
49                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
50                  </div>
51                  <CardDescription>{quiz.description}</CardDescription>
52                </CardHeader>
53                <CardContent>
54                  <p className="text-sm text-muted-foreground">10 questions</p>
55                </CardContent>
56              </Card>
57            );
58          })}
59        </div>
60      </div>
61    </Layout>
62  );
63}