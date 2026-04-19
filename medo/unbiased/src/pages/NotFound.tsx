import { Link } from "react-router-dom";
2import PageMeta from "@/components/common/PageMeta";
3
4export default function NotFound() {
5  return (
6    <>
7      <PageMeta title="Page Not Found" description="" />
8      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
9        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
10          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
11            ERROR
12          </h1>
13
14          <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
15          <img
16            src="/images/error/404-dark.svg"
17            alt="404"
18            className="hidden dark:block"
19          />
20
21          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
22            The page may have been deleted or does not exist. Please check the
23            URL is correct.
24          </p>
25
26          <Link
27            to="/"
28            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
29          >
30            Back to home
31          </Link>
32        </div>
33        {/* <!-- Footer --> */}
34        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
35          &copy; {new Date().getFullYear()}
36        </p>
37      </div>
38    </>
39  );
40}