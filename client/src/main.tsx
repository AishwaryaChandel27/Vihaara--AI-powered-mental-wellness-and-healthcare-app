import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SettingsProvider } from "./contexts/SettingsContext";

createRoot(document.getElementById("root")!).render(
  <SettingsProvider>
    <App />
  </SettingsProvider>
);
