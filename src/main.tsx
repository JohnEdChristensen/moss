import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "./system/theme.tsx";
import { App } from "./App.tsx";
import "./style.css"

function Root() {
  return <App />
}


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </React.StrictMode>,
);
