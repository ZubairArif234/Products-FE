import "./App.css";
import Router from "./router/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
const client = new QueryClient();
function App() {
  return (
    
    <QueryClientProvider client={client}>
      <AuthProvider>
      <Router />
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
