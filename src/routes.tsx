// Screens.
import { HomeScreen, InvoiceGeneratorScreen } from '@/screens';

// Interfaces.
import type { RouteObject } from 'react-router-dom';

import LoginSignUp from './LoginSignUp/LoginSignUp';
import Login from './LoginSignUp/Login';

// Routes object.
const routes = (): Array<RouteObject> => [
  {
    path:'/login',
    element:<Login></Login>
  },
  {
    path: '/',
    element: <LoginSignUp></LoginSignUp>
  },
  {
    path: '/enter',
    element: <HomeScreen />,
  },
  {
    path: '/generator',
    element: <InvoiceGeneratorScreen />,
  },
];

export default routes;
