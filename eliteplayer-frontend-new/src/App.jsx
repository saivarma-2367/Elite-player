import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import createAppRouter from './routes/AppRoutes';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  const router = createAppRouter(user, setUser, admin, setAdmin);

  return <RouterProvider router={router} />;
}

export default App;
