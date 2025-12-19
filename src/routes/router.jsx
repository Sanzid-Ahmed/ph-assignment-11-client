import { createBrowserRouter } from "react-router-dom";

// Layouts
import RootLayout from "../layouts/RootLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

// Pages
import HomePage from "../pages/public/HomePage.jsx";
import Login from "../pages/public/Login.jsx";
import RegisterHR from "../pages/public/RegisterHR.jsx";
import RegisterEmployee from "../pages/public/RegisterEmployee.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import AssetLists from "../pages/hr/assetLists.jsx";
import AllRequests from "../pages/hr/AllRequests.jsx";
import MyEmployeeList from "../pages/hr/MyEmployeeList.jsx";
import UpgradePackage from "../pages/hr/UpgradePackage.jsx";
import HrProfile from "../pages/hr/HrProfile.jsx";
import AddAsset from "../pages/hr/addAsset.jsx";
import EmployeeProfile from "../pages/employee/EmployeeProfile.jsx";
import MyAssets from "../pages/employee/MyAssets.jsx";
import MyTeam from "../pages/employee/MyTeam.jsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />, // Auth pages layout
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register-hr", element: <RegisterHR /> },
      { path: "/register-employee", element: <RegisterEmployee /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "asset-lists",
        element: <AssetLists />
      },
      {
        path: "add-asset",
        element: <AddAsset />
      },
      {
        path: "all-requests",
        element: <AllRequests /> 
      },
      {
        path: "employees",
        element: <MyEmployeeList />
      },
      {
        path: "upgrade",
        element: <UpgradePackage />
      },
      {
        path: "hr-profile",
        element: <HrProfile />
      },
      //employee
      {
        path: "employee-profile",
        element: <EmployeeProfile />
      },
      {
        path: "my-assets",
        element: <MyAssets />
      },
      {
        path: "my-team",
        element: <MyTeam />
      },
    ]
  }, 
]);
