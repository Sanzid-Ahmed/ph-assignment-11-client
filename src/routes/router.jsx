import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import JoinEmployeePage from "../pages/public/JoinEmployeePage";
import JoinHRManagerPage from "../pages/public/JoinHRManagerPage";
import AuthLayout from "../layouts/AuthLayout";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: '/login',
        Component: LoginPage
      },
      {
        path: '/join-employee',
        Component: JoinEmployeePage
      },
      {
        path: '/join-hr',
        Component: JoinHRManagerPage
      }
    ]
  },
]);
