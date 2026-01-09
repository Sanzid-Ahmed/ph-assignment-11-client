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
import RequestAsset from "../pages/employee/RequestAsset.jsx";
import PaymentSuccess from "../pages/hr/payment/PaymentSuccess.jsx";
import PaymentCancelled from "../pages/hr/payment/PaymentCancelled.jsx";
import AssignAsset from "../pages/hr/payment/AssignEmployee.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import HRAnalytics from "../pages/hr/HRAnalytics.jsx";
import HRRout from "./HRRout.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import AboutUs from "../pages/public/AboutUs.jsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/about-us", element: <AboutUs /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register-hr", element: <RegisterHR /> },
      { path: "/register-employee", element: <RegisterEmployee /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "hr-alytics",
        element: <HRRout><HRAnalytics /></HRRout> 
      },
      {
        path: "asset-lists",
        element: <HRRout><AssetLists /></HRRout>
      },
      {
        path: "add-asset",
        element: <HRRout><AddAsset /></HRRout>
      },
      {
        path: "all-requests",
        element: <HRRout><AllRequests /></HRRout>
      },
      {
        path: "employees",
        element: <HRRout><MyEmployeeList /></HRRout>
      },
      {
        path: "upgrade",
        element: <HRRout><UpgradePackage /></HRRout>
      },
      {
        path: "hr-profile",
        element: <HRRout><HrProfile /></HRRout>
      },
      {
        path: "assign-asset/:id", 
        element: <HRRout><AssignAsset /></HRRout>
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
      {
        path: "request-asset",
        element: <RequestAsset />
      },
      //payment
      {
        path: "upgrade",
        element: <HRRout><UpgradePackage /></HRRout>,
      },
      {
        path: "payment-success",
        element: <HRRout><PaymentSuccess /></HRRout>,
      },
      {
        path: "payment-cancelled",
        element: <HRRout><PaymentCancelled /></HRRout>,
      },
    ]
  },
  {
    path: "*",
    element: <ErrorPage />
  } 
]);
