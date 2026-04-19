import React from 'react';
2import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
3import IntersectObserver from '@/components/common/IntersectObserver';
4import { Toaster } from '@/components/ui/sonner';
5import { AppProvider } from '@/contexts/AppContext';
6
7import { routes } from './routes';
8
9const App: React.FC = () => {
10  return (
11    <Router>
12      <AppProvider>
13        <IntersectObserver />
14        <Routes>
15          {routes.map((route, index) => (
16            <Route
17              key={index}
18              path={route.path}
19              element={route.element}
20            />
21          ))}
22          <Route path="*" element={<Navigate to="/" replace />} />
23        </Routes>
24        <Toaster />
25      </AppProvider>
26    </Router>
27  );
28};
29
30export default App;