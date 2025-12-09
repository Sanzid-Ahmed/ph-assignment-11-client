import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import JoinEmployeePage from "../pages/public/JoinEmployeePage";
import JoinHRManagerPage from "../pages/public/JoinHRManagerPage";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/join-employee',
        element: <JoinEmployeePage />,
      },
      {
        path: '/join-hr',
        element: <JoinHRManagerPage />,
      },
    ],
  },
]);
