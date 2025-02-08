import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { UserProvider } from "./lib/contexts/UserContext";
import { TempoDevtools } from "tempo-devtools";
import App from "./App";
import "./index.css";

TempoDevtools.init();

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      {import.meta.env.PROD ? (
        <HashRouter>
          <UserProvider>
            <App />
          </UserProvider>
        </HashRouter>
      ) : (
        <BrowserRouter>
          <UserProvider>
            <App />
          </UserProvider>
        </BrowserRouter>
      )}
    </React.StrictMode>,
  );
}
