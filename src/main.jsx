import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Root } from "./main/Root.dev.jsx";
import { store } from "./data/store";

createRoot(document.getElementById("root")).render(<Root store={store} />);
