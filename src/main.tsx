import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./style.css"

import { Frame } from "./Frame.tsx";
import { TitleBar } from "./components/TitleBar.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <Frame />
  </React.StrictMode>,
);
