import { createRoot } from "react-dom/client";
2import "./index.css";
3import App from "./App.tsx";
4import { AppWrapper } from "./components/common/PageMeta.tsx";
5
6createRoot(document.getElementById("root")!).render(
7  <AppWrapper>
8    <App />
9  </AppWrapper>
10);