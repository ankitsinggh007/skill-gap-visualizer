import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AnalyzeProvider } from "./context/AnalyzeContext.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <AnalyzeProvider>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </AnalyzeProvider>
);
