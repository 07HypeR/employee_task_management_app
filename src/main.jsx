import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Suppress Zustand deprecation warnings from Vercel's analytics tooling
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("Default export is deprecated") ||
      message.includes("zustand"))
  ) {
    return; // Suppress this specific warning
  }
  originalWarn.apply(console, args);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
