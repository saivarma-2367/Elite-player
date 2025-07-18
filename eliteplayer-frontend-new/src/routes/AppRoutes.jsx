import { createBrowserRouter } from 'react-router-dom';
import { getRoutes } from './routes';

const createAppRouter = (user, setUser, admin, setAdmin) => {
  const routes = getRoutes(user, setUser, admin, setAdmin);
  return createBrowserRouter(routes);
};

export default createAppRouter;
