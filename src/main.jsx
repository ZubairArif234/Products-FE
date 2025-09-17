import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import { theme } from "./configs/theme.config.js";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
// import "mantine-react-table/styles.css";
import QueryProvider from "./configs/query.config.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider >
      <QueryProvider>
            <App />
             <Toaster richColors />
      </QueryProvider>
    </MantineProvider>
  </StrictMode>
);