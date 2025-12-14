import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout"; // Assumed layout for login/join pages
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import JoinEmployeePage from "../pages/public/JoinEmployeePage";
import JoinHRManagerPage from "../pages/public/JoinHRManagerPage";
import ErrorPage from "../pages/shared/ErrorPage";

// HR Dashboard Pages
import AssetListPage from "../pages/hr/AssetListPage";
import AddAssetPage from "../pages/hr/AddAssetPage";
import AllRequestsPage from "../pages/hr/AllRequestsPage";
import MyEmployeeListPage from "../pages/hr/MyEmployeeListPage";
import UpgradePackagePage from "../pages/hr/UpgradePackagePage";

// Employee Dashboard Pages
import MyAssetsPage from "../pages/employee/MyAssetsPage";
import RequestAssetPage from "../pages/employee/RequestAssetPage";
import MyTeamPage from "../pages/employee/MyTeamPage";

// Shared Pages
import ProfilePage from "../pages/shared/ProfilePage";

// Route Protection
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
    // --- 1. Main Public Routes (Using MainLayout for Navbar/Footer) ---
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        ],
    },

    // --- 2. Authentication Routes (Using AuthLayout for Centered Content) ---
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'join-employee',
                element: <JoinEmployeePage />
            },
            {
                path: 'join-hr',
                element: <JoinHRManagerPage />
            }
        ]
    },

    // --- 3. HR Manager Dashboard Routes (Protected by PrivateRoute and Role Guard) ---
    {
        path: "/hr-dashboard",
        element: (
            <PrivateRoute requiredRole="hr">
                <DashboardLayout />
            </PrivateRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            // HR Dashboard Home (Asset List & Analytics)
            {
                index: true, 
                element: <AssetListPage />,
            },
            // Asset Management
            {
                path: "add-asset",
                element: <AddAssetPage />,
            },
            // Request Management
            {
                path: "all-requests",
                element: <AllRequestsPage />,
            },
            // Employee & Package Management
            {
                path: "my-employees",
                element: <MyEmployeeListPage />,
            },
            {
                path: "upgrade-package",
                element: <UpgradePackagePage />,
            },
            // Shared Profile
            {
                path: "profile",
                element: <ProfilePage />,
            },
        ],
    },

    // --- 4. Employee Dashboard Routes (Protected by PrivateRoute and Role Guard) ---
    {
        path: "/employee-dashboard",
        element: (
            <PrivateRoute requiredRole="employee">
                <DashboardLayout />
            </PrivateRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            // Employee Dashboard Home (My Assets List)
            {
                index: true,
                element: <MyAssetsPage />,
            },
            // Request Asset
            {
                path: "request-asset",
                element: <RequestAssetPage />,
            },
            // My Team/Colleagues
            {
                path: "my-team",
                element: <MyTeamPage />,
            },
            // Shared Profile
            {
                path: "profile",
                element: <ProfilePage />,
            },
        ],
    },
]);

// Exporting as default is also common, but keeping 'export const router' as per standard convention
// export default router;