import { ThemeProvider } from '@/shared/contexts/Theme/ThemeContext';
import { queryClient } from '@/shared/lib/react-query';
import Router from '@/shared/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <ToastContainer
          position="top-right"
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
