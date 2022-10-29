import app, {init} from '@/app';
import AppLog from './events/AppLog';

const PORT = process.env.PORT || 5000;

init().then(() => {
  app.get('/health', (_req, res) => {
    res.send('OK');
  });

  app.listen(PORT, () => {
    AppLog('Server', `Server running on port ${PORT}`);
  });
})