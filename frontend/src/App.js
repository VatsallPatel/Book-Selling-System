import "./App.css";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./Pages/AdminLogin";
import UserLogin from "./Pages/UserLogin";
import Signup from "./Pages/Signup";
import Protected from "./Utils/ProtectedRoute";
import Navbar from "./Components/Navbar";
import AdminHome from "./Pages/AdminHome";
import Page404 from "./Pages/Page404";
import { DarkModeContextProvider } from "./Context/DarkModeContext";
import AddBook from "./Pages/AddBook";
import BookDetails from "./Pages/BookDetails";
import EditBookDetails from "./Pages/EditBookDetails";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import AdminSidebar from "./Components/AdminSidebar";
import AdminDashboard from "./Pages/AdminDashboard";
import React, { useState } from "react";
import AdminBookDetails from "./Pages/AdminBookDetails";
import PendingOrders from "./Pages/PendingOrders";
import AcceptedOrders from "./Pages/AcceptedOrders";
import RejectedOrders from "./Pages/RejectedOrders";
import MyOrders from "./Pages/MyOrders";
import CancelledOrders from "./Pages/CancelledOrders";
// import Cookies from "js-cookie";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const role = Cookies.get("role") || "";

  const Layout = () => {
    return (
      <DarkModeContextProvider>
        <div>
          <Navbar values={{ sidebarOpen, setSidebarOpen }} />
          <div className="listing row m-0 p-0">
            {/* {role === "admin" && <AdminSidebar />} */}
            <Outlet />
          </div>
        </div>
      </DarkModeContextProvider>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Protected>
          <Layout />
        </Protected>
      ),

      children: [
        {
          path: "/admin-dashboard",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <AdminDashboard />,
          ],
        },
        {
          path: "/admin-home",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <AdminHome />,
          ],
        },
        {
          path: "/admin-book-detail",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <AdminBookDetails />,
          ],
        },
        {
          path: "/pending-order",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <PendingOrders />,
          ],
        },
        {
          path: "/accepted-order",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <AcceptedOrders />,
          ],
        },
        {
          path: "/rejected-order",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <RejectedOrders />,
          ],
        },
        {
          path: "/add-book",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <AddBook />,
          ],
        },
        {
          path: "/edit-detail",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <EditBookDetails />,
          ],
        },
        {
          path: "/cancelled-order",
          element: [
            <AdminSidebar values={{ sidebarOpen, setSidebarOpen }} />,
            <CancelledOrders />,
          ],
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/book-detail",
          element: <BookDetails />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/order-history",
          element: <MyOrders />,
        },
      ],
    },
    {
      path: "/login",
      element: <UserLogin />,
    },
    {
      path: "/admin-login",
      element: <AdminLogin />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "*",
      element: <Page404 />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
