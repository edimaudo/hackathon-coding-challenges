 import * as vite from 'vite';
3    import { defineConfig, loadConfigFromFile } from "vite";
4    import type { Plugin, ConfigEnv } from "vite";
5    import tailwindcss from "tailwindcss";
6    import autoprefixer from "autoprefixer";
7    import fs from "fs/promises";
8    import path from "path";
9    import {
10      makeTagger,
11      injectedGuiListenerPlugin,
12      injectOnErrorPlugin,
13      monitorPlugin
14    } from "miaoda-sc-plugin";
15
16    const env: ConfigEnv = { command: "serve", mode: "development" };
17    const configFile = path.resolve(__dirname, "vite.config.ts");
18    const result = await loadConfigFromFile(env, configFile);
19    const userConfig = result?.config;
20
21    const viteVersionInfo = {
22      version: vite.version,
23      rollupVersion: (vite as any).rollupVersion ?? null,
24      rolldownVersion: (vite as any).rolldownVersion ?? null,
25      isRolldownVite: 'rolldownVersion' in vite
26    };
27
28    export default defineConfig({
29      ...userConfig,
30      define: {
31        __VITE_INFO__: JSON.stringify(viteVersionInfo),
32        ...(userConfig?.define || {})
33      },
34      // 将 Vite 缓存目录设置为项目本地目录，避免在 /workspace/node_modules/ 下创建
35      cacheDir: path.resolve(__dirname, "node_modules/.vite"),
36      plugins: [
37        makeTagger(),
38        injectedGuiListenerPlugin({
39          path: 'https://miaoda-resource-static.s3cdn.medo.dev/common/v2/injected.js'
40        }),
41        injectOnErrorPlugin(),
42        ...(userConfig?.plugins || []),
43        
44{
45  name: 'hmr-toggle',
46  configureServer(server) {
47    let hmrEnabled = true;
48
49    // 包装原来的 send 方法
50    const _send = server.ws.send;
51    server.ws.send = (payload) => {
52      if (hmrEnabled) {
53        return _send.call(server.ws, payload);
54      } else {
55        console.log('[HMR disabled] skipped payload:', payload.type);
56      }
57    };
58
59    // 提供接口切换 HMR
60    server.middlewares.use('/innerapi/v1/sourcecode/__hmr_off', (req, res) => {
61      hmrEnabled = false;
62      let body = {
63          status: 0,
64          msg: 'HMR disabled'
65      };
66      res.setHeader('Content-Type', 'application/json');
67      res.end(JSON.stringify(body));
68    });
69
70    server.middlewares.use('/innerapi/v1/sourcecode/__hmr_on', (req, res) => {
71      hmrEnabled = true;
72      let body = {
73          status: 0,
74          msg: 'HMR enabled'
75      };
76      res.setHeader('Content-Type', 'application/json');
77      res.end(JSON.stringify(body));
78    });
79
80    // 注册一个 HTTP API，用来手动触发一次整体刷新
81    server.middlewares.use('/innerapi/v1/sourcecode/__hmr_reload', (req, res) => {
82      if (hmrEnabled) {
83        server.ws.send({
84          type: 'full-reload',
85          path: '*', // 整页刷新
86        });
87      }
88      res.statusCode = 200;
89      let body = {
90          status: 0,
91          msg: 'Manual full reload triggered'
92      };
93      res.setHeader('Content-Type', 'application/json');
94      res.end(JSON.stringify(body));
95    });
96  },
97  load(id) {
98    if (id === 'virtual:after-update') {
99      return `
100        if (import.meta.hot) {
101          import.meta.hot.on('vite:afterUpdate', () => {
102            window.postMessage(
103              {
104                type: 'editor-update'
105              },
106              '*'
107            );
108          });
109        }
110      `;
111    }
112  },
113  transformIndexHtml(html) {
114    return {
115      html,
116      tags: [
117        {
118          tag: 'script',
119          attrs: {
120            type: 'module',
121            src: '/@id/virtual:after-update'
122          },
123          injectTo: 'body'
124        }
125      ]
126    };
127  }
128},
129,
130        monitorPlugin(
131          {
132            scriptSrc: 'https://miaoda-resource-static.s3cdn.medo.dev/sentry/browser.sentry.min.js',
133            sentryDsn: 'https://e3c07b90fcb5207f333d50ac24a99d3e@sentry.miaoda.cn/233',
134            environment: 'undefined',
135            appId: 'app-b2nnykhvf30h'
136          }
137        )
138      ]
139    });