import { useNavigate } from 'react-router-dom';
2import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
3import { Brain, Target, Settings } from 'lucide-react';
4import { useApp } from '@/contexts/AppContext';
5import { t } from '@/lib/i18n';
6
7export function NavigationCards() {
8  const { language } = useApp();
9  const navigate = useNavigate();
10
11  const cards = [
12    {
13      title: t('home.explore_biases', language),
14      description: t('home.explore_desc', language),
15      icon: Brain,
16      path: '/bias-explorer',
17      color: 'text-primary',
18    },
19    {
20      title: t('home.test_knowledge', language),
21      description: t('home.detector_desc', language),
22      icon: Target,
23      path: '/bias-detector',
24      color: 'text-primary',
25    },
26    {
27      title: t('home.customize', language),
28      description: t('home.settings_desc', language),
29      icon: Settings,
30      path: '/settings',
31      color: 'text-primary',
32    },
33  ];
34
35  return (
36    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
37      {cards.map((card) => {
38        const Icon = card.icon;
39        return (
40          <Card
41            key={card.path}
42            className="editorial-shadow smooth-transition hover:shadow-lg cursor-pointer"
43            onClick={() => navigate(card.path)}
44          >
45            <CardHeader>
46              <div className="flex items-center gap-3">
47                <Icon className={`h-8 w-8 ${card.color}`} />
48                <CardTitle className="text-xl">{card.title}</CardTitle>
49              </div>
50            </CardHeader>
51            <CardContent>
52              <CardDescription>{card.description}</CardDescription>
53            </CardContent>
54          </Card>
55        );
56      })}
57    </div>
58  );
59}