import App from './App.tsx'
import './index.css'
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
} from "react-router-dom";


const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
