import { useEffect } from 'react';
2import { useNavigate, useLocation } from 'react-router-dom';
3import { useAuth } from '@/contexts/AuthContext';
4import { routes } from '@/routes';
5
6interface RouteGuardProps {
7  children: React.ReactNode;
8}
9
10// System-level public routes (no need to register in routes.tsx)
11const SYSTEM_PUBLIC_ROUTES = ['/login', '/403', '/404'];
12
13// Derived from routes.tsx: all routes marked with public: true
14const routePublicPaths = routes.filter(r => r.public).map(r => r.path);
15
16const PUBLIC_ROUTES = [...SYSTEM_PUBLIC_ROUTES, ...routePublicPaths];
17
18function matchPublicRoute(path: string, patterns: string[]) {
19  return patterns.some(pattern => {
20    if (pattern.includes('*')) {
21      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
22      return regex.test(path);
23    }
24    return path === pattern;
25  });
26}
27
28export function RouteGuard({ children }: RouteGuardProps) {
29  const { user, loading } = useAuth();
30  const navigate = useNavigate();
31  const location = useLocation();
32
33  useEffect(() => {
34    if (loading) return;
35
36    const isPublic = matchPublicRoute(location.pathname, PUBLIC_ROUTES);
37
38    if (!user && !isPublic) {
39      navigate('/login', { state: { from: location.pathname }, replace: true });
40    }
41  }, [user, loading, location.pathname, navigate]);
42
43  if (loading) {
44    return (
45      <div className="flex items-center justify-center min-h-screen">
46        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
47      </div>
48    );
49  }
50
51  return <>{children}</>;
52}