import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import '@radix-ui/themes/styles.css';
import "./index.css";
import { Theme } from '@radix-ui/themes';



ReactDOM.createRoot(document.getElementById("root")!).render(
  <html>
    <body>
      <Theme>
        <App />
      </Theme>
    </body>
  </html>,
);
