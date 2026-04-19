import { defineConfig } from "vite";
2import { miaodaDevPlugin } from "miaoda-sc-plugin";
3import react from "@vitejs/plugin-react";
4import svgr from "vite-plugin-svgr";
5import path from "path";
6
7// https://vite.dev/config/
8export default defineConfig({
9  plugins: [
10    react(),
11    miaodaDevPlugin(),
12    svgr({
13      svgrOptions: {
14        icon: true,
15        exportType: "named",
16        namedExport: "ReactComponent",
17      },
18    }),
19  ],
20  resolve: {
21    alias: {
22      "@": path.resolve(__dirname, "./src"),
23    },
24  },
25});