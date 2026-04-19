1import { Layout } from '@/components/layouts/Layout';
2import { BiasOfTheDay } from '@/components/home/BiasOfTheDay';
3import { NavigationCards } from '@/components/home/NavigationCards';
4
5export default function HomePage() {
6  return (
7    <Layout>
8      <div className="container px-4 py-12 max-w-6xl mx-auto">
9        <div className="space-y-12">
10          {/* Bias of the Day Section */}
11          <section>
12            <BiasOfTheDay />
13          </section>
14
15          {/* Navigation Cards Section */}
16          <section>
17            <NavigationCards />
18          </section>
19        </div>
20      </div>
21    </Layout>
22  );
23}