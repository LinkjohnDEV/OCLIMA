import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./context/theme-provider";
import { CityPage } from "./pages/city-page";
import NotFound from "./pages/not-found";
import { WeatherDashboard } from "./pages/weather-dashboard";
import { MockupPage } from "./pages/mockup-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Routes>
              <Route path="/" element={<WeatherDashboard />} />
              <Route path="/city/:cityName" element={<CityPage />} />
              <Route path="/mockup" element={<MockupPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
