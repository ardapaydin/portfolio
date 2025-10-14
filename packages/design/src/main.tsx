import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './design/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
if (process.env.NODE_ENV === "production") axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
else axios.defaults.baseURL = "/api";

axios.defaults.validateStatus = () => true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: async ({ queryKey }) => {
            const [url, params] = queryKey as [string, Map<string, unknown>];
            const res = await axios.get(url, { params });
            return res.data;
          },
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
          retry: false,
          staleTime: 5 * 60 * 1000
        },
      },
    })}>
      <BrowserRouter>
        {
          (() => {
            const subdomain = window.location.hostname.split('.')[0];
            console.log(subdomain);
            if (subdomain === 'localhost' || subdomain === 'design') return <App />;
            return <div />;
          })()
        }
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
