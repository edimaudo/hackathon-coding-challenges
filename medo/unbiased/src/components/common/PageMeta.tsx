import { HelmetProvider, Helmet } from "react-helmet-async";
2import { TooltipProvider } from "@/components/ui/tooltip";
3
4const PageMeta = ({
5  title,
6  description,
7}: {
8  title: string;
9  description: string;
10}) => (
11  <Helmet>
12    <title>{title}</title>
13    <meta name="description" content={description} />
14  </Helmet>
15);
16
17export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
18  <HelmetProvider>
19    <TooltipProvider>
20      {children}
21    </TooltipProvider>
22  </HelmetProvider>
23);
24
25export default PageMeta;