// router.jsx
import { createBrowserRouter } from "react-router-dom";

// Layouts & Components
import App from "@/App";
import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import { ProtectedRoutes } from "./ProtectedRoutes";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
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
]);

export default router;
