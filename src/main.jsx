import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { WindowSizeClassProvider } from "./contexts/WindowSizeClassContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WindowSizeClassProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </WindowSizeClassProvider>
  </BrowserRouter>
);
