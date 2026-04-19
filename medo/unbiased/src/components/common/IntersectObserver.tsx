import { useEffect } from 'react';
2import { useLocation } from 'react-router-dom';
3import { Observer } from 'tailwindcss-intersect';
4
5const IntersectObserver = () => {
6  const location = useLocation();
7
8  useEffect(() => {
9    // When the location changes, we need to restart the observer
10    // to pick up new elements on the page.
11    // We use a small timeout to ensure the DOM has updated.
12    const timer = setTimeout(() => {
13        Observer.restart();
14    }, 100);
15
16    return () => clearTimeout(timer);
17  }, [location]);
18
19  return null;
20};
21
22export default IntersectObserver;
23