// router.jsx
import { createBrowserRouter } from "react-router-dom";

// Layouts & Components
import App from "@/App";
import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import { ProtectedRoutes } from "./ProtectedRoutes";

// import DashboardLayout from "@/layouts/Dashboardlayout";

// // Pages
// import Home from "@/pages/Home";
// import About from "@/pages/About";
// import Products from "@/pages/Products";
// import Cart from "@/pages/Cart";
// import Login from "@/pages/Login";
// import Register from "@/pages/Register";
// import ForgotPassword from "@/pages/Forgotpassword";
// import VerifyOtp from "@/pages/Verifyotp";
// import ResetPassword from "@/pages/Resetpassword";
// import Payment from "@/pages/Payment";
// import Receipt from "@/pages/Receipt";

// // Protected Routes
// import PrivateRoutes from "./PrivateRoutes";

// // Admin Pages
// import Dashboard from "@/pages/Dashboard";
// import AddPCPart from "@/pages/AddPCPart";
// import AddCompletePc from "@/pages/AddCompletePc";
// import RevenueAnalytics from "@/pages/RevenueAnalytics";
// import Orders from "@/pages/Orders";
// import Customers from "@/pages/Customers";
// import Settings from "@/pages/Settings";
// import Coupons from "@/pages/Coupons";
// import AdminProtectedRoute from "./AdminProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // User Protected Routes
      //   {
      //     element: <PrivateRoutes />,
      //     children: [
      //       { path: "orders", element: <Orders /> },
      //       // Add more user protected routes here
      //       // { path: "profile", element: <Profile /> },
      //     ],
      //   },
    ],
  },

  //   // ADMIN ROUTES
  //   {
  //     path: "/admin",
  //     element: <AdminProtectedRoute />,
  //     children: [
  //       {
  //         element: <DashboardLayout />,
  //         children: [
  //           { index: true, element: <Dashboard /> },
  //           { path: "products/add-part", element: <AddPCPart /> },
  //           { path: "products/add-pc", element: <AddCompletePc /> },
  //           { path: "orders", element: <Orders /> },
  //           { path: "customers", element: <Customers /> },
  //           { path: "analytics", element: <RevenueAnalytics /> },
  //           { path: "coupons", element: <Coupons /> },
  //           { path: "settings", element: <Settings /> },
  //         ],
  //       },
  //     ],
  //   },
]);

export default router;
