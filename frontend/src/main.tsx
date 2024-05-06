import App from './App.tsx'
import './index.css'
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// custom pages
import ErrorPage from "./error-page";
import Home from './root/index.tsx';
import Sing from './auth/signin/index.tsx';
import SingUp from './auth/singup/index.tsx';
import AuthLayout from './auth/AuthLayout.tsx';
import SignIn from './auth/signin/index.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/singup",
        element: <SingUp />,
      },
    ]
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <RouterProvider router={router} />
  );
}
