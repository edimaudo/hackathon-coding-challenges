import { Menu } from 'lucide-react';
2import { Link, useLocation } from 'react-router-dom';
3import { Button } from '@/components/ui/button';
4import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
5import { useApp } from '@/contexts/AppContext';
6import { t } from '@/lib/i18n';
7import { useState } from 'react';
8
9interface LayoutProps {
10  children: React.ReactNode;
11}
12
13export function Layout({ children }: LayoutProps) {
14  const { language } = useApp();
15  const location = useLocation();
16  const [open, setOpen] = useState(false);
17
18  const navItems = [
19    { path: '/', label: t('nav.home', language) },
20    { path: '/bias-explorer', label: t('nav.bias_explorer', language) },
21    { path: '/bias-detector', label: t('nav.bias_detector', language) },
22    { path: '/settings', label: t('nav.settings', language) },
23  ];
24
25  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
26    <nav className="flex flex-col gap-2">
27      {navItems.map((item) => (
28        <Link
29          key={item.path}
30          to={item.path}
31          onClick={onClick}
32          className={`px-4 py-2 rounded-md smooth-transition ${
33            location.pathname === item.path
34              ? 'bg-primary text-primary-foreground'
35              : 'hover:bg-accent hover:text-accent-foreground'
36          }`}
37        >
38          {item.label}
39        </Link>
40      ))}
41    </nav>
42  );
43
44  return (
45    <div className="min-h-screen flex flex-col">
46      {/* Header */}
47      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 editorial-shadow">
48        <div className="container flex h-16 items-center justify-between px-4">
49          <Link to="/" className="flex items-center gap-2">
50            <span className="text-xl font-bold">{t('app_name', language)}</span>
51          </Link>
52
53          {/* Mobile menu */}
54          <Sheet open={open} onOpenChange={setOpen}>
55            <SheetTrigger asChild>
56              <Button variant="ghost" size="icon" className="md:hidden">
57                <Menu className="h-6 w-6" />
58                <span className="sr-only">Toggle menu</span>
59              </Button>
60            </SheetTrigger>
61            <SheetContent side="right" className="w-64">
62              <div className="mt-8">
63                <NavLinks onClick={() => setOpen(false)} />
64              </div>
65            </SheetContent>
66          </Sheet>
67
68          {/* Desktop navigation */}
69          <nav className="hidden md:flex gap-1">
70            {navItems.map((item) => (
71              <Link
72                key={item.path}
73                to={item.path}
74                className={`px-4 py-2 rounded-md smooth-transition ${
75                  location.pathname === item.path
76                    ? 'bg-primary text-primary-foreground'
77                    : 'hover:bg-accent hover:text-accent-foreground'
78                }`}
79              >
80                {item.label}
81              </Link>
82            ))}
83          </nav>
84        </div>
85      </header>
86
87      {/* Main content */}
88      <main className="flex-1 fade-in">
89        {children}
90      </main>
91
92      {/* Footer */}
93      <footer className="border-t py-6 editorial-divider">
94        <div className="container px-4 text-center text-sm text-muted-foreground">
95          <p>{t('app_name', language)} © 2026</p>
96        </div>
97      </footer>
98    </div>
99  );
100}