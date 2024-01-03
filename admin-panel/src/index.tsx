import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContextProvider } from './context/AppContext';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import CallerView from './views/CallerView';
import EventView from './views/EventView';
import AudioView from './views/AudioView';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: <Navigate to="callers" />,
        },
        {
          path: '/callers',
          element: <CallerView />,
        },
        {
          path: '/events',
          element: <EventView />,
        },
        {
          path: '/audio',
          element: <AudioView />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/callers" />,
    },
  ],
  {
    basename: '/adminpanel',
  },
);

root.render(
  <React.StrictMode>
    <ToastContainer />
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
