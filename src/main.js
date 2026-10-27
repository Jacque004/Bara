import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App";
registerSW({ immediate: true });
const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60_000, retry: 1 },
    },
});
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/", children: _jsx(App, {}) }) }) }));
