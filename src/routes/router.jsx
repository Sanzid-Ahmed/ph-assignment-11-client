import { createBrowserRouter } from "react-router-dom";

// Layouts
import RootLayout from "../layouts/RootLayout.jsx";
import EmployeeDashboardLayout from "../layouts/EmployeeDashboardLayout.jsx";
import HRManagerDashboardLayout from "../layouts/HRManagerDashboardLayout.jsx";

// Public Pages
import HomePage from "../pages/public/HomePage.jsx";
import LoginPage from "../pages/public/LoginPage.jsx";
import JoinEmployeePage from "../pages/public/JoinEmployeePage.jsx";
import JoinHRManagerPage from "../pages/public/JoinHRManagerPage.jsx";
import ErrorPage from "../pages/shared/ErrorPage.jsx";

// HR Dashboard Pages
import AssetListPage from "../pages/hr/AssetListPage.jsx";
import AddAssetPage from "../pages/hr/AddAssetPage.jsx";
import AllRequestsPage from "../pages/hr/AllRequestsPage.jsx";
import MyEmployeeListPage from "../pages/hr/MyEmployeeListPage.jsx";
import UpgradePackagePage from "../pages/hr/UpgradePackagePage.jsx";

// Employee Dashboard Pages
import MyAssetsPage from "../pages/employee/MyAssetsPage.jsx";
import RequestAssetPage from "../pages/employee/RequestAssetPage.jsx";
import MyTeamPage from "../pages/employee/MyTeamPage.jsx";

// Shared Pages
import ProfilePage from "../pages/shared/ProfilePage.jsx";

// Route Protection
import PrivateRoute from "../components/auth/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join-employee", element: <JoinEmployeePage /> },
      { path: "join-hr", element: <JoinHRManagerPage /> },
    ],
  },

  // HR Dashboard Routes
  {
    path: "/hr-dashboard",
    element: (
      <PrivateRoute requiredRole="hr">
        <HRManagerDashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AssetListPage /> },
      { path: "add-asset", element: <AddAssetPage /> },
      { path: "all-requests", element: <AllRequestsPage /> },
      { path: "my-employees", element: <MyEmployeeListPage /> },
      { path: "upgrade-package", element: <UpgradePackagePage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  // Employee Dashboard Routes
  {
    path: "/employee-dashboard",
    element: (
      <PrivateRoute requiredRole="employee">
        <EmployeeDashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MyAssetsPage /> },
      { path: "request-asset", element: <RequestAssetPage /> },
      { path: "my-team", element: <MyTeamPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
