
  import { createRoot } from "react-dom/client";
  import { registerSW } from "virtual:pwa-register";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Register the service worker so the app precaches its shell and runs offline.
  registerSW({ immediate: true });

  createRoot(document.getElementById("root")!).render(<App />);
  