import HomePage from './pages/HomePage';
2import BiasListPage from './pages/BiasListPage';
3import BiasDetailPage from './pages/BiasDetailPage';
4import QuizSelectionPage from './pages/QuizSelectionPage';
5import NameThatBiasQuiz from './pages/NameThatBiasQuiz';
6import BiasCheckerQuiz from './pages/BiasCheckerQuiz';
7import SettingsPage from './pages/SettingsPage';
8import type { ReactNode } from 'react';
9
10export interface RouteConfig {
11  name: string;
12  path: string;
13  element: ReactNode;
14  visible?: boolean;
15  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
16  public?: boolean;
17}
18
19export const routes: RouteConfig[] = [
20  {
21    name: 'Home',
22    path: '/',
23    element: <HomePage />,
24    public: true,
25  },
26  {
27    name: 'Bias Explorer',
28    path: '/bias-explorer',
29    element: <BiasListPage />,
30    public: true,
31  },
32  {
33    name: 'Bias Detail',
34    path: '/bias-explorer/:id',
35    element: <BiasDetailPage />,
36    public: true,
37  },
38  {
39    name: 'Bias Detector',
40    path: '/bias-detector',
41    element: <QuizSelectionPage />,
42    public: true,
43  },
44  {
45    name: 'Name That Bias Quiz',
46    path: '/bias-detector/name-that-bias',
47    element: <NameThatBiasQuiz />,
48    public: true,
49  },
50  {
51    name: 'Bias Checker Quiz',
52    path: '/bias-detector/bias-checker',
53    element: <BiasCheckerQuiz />,
54    public: true,
55  },
56  {
57    name: 'Settings',
58    path: '/settings',
59    element: <SettingsPage />,
60    public: true,
61  },
62];
63