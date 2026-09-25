import App from '@/App.tsx';
import { syncSessionFromOtherTabs } from '@/modules/auth/store/useAuthStore';
import '@/shared/styles/global-styles.css';
import { createRoot } from 'react-dom/client';

syncSessionFromOtherTabs().finally(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
