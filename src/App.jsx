import "./App.css";
import Router from "./router/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const client = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={client}>
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
