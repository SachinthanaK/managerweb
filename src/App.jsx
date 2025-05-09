import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import RootLayout from "./pages/RootLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/Customers";
import Finances from "./pages/Finances";
import Messages from "./pages/Messanger/Messages";
import Orders from "./pages/Orders";
const Products = lazy(() => import("./pages/Products"));
import Settings from "./pages/Settings";
import CustomerDetailsPage from "./pages/CustomerDetails";
import OrderDetailsPage from "./pages/OrderDetails";
import NavBar from "./NavBar/NavBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavBar />
        <RootLayout />
      </>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "orders/:orderId", element: <OrderDetailsPage /> },
      { path: "finances", element: <Finances /> },
      { path: "products", element: <Products /> },
      { path: "messages", element: <Messages /> },
      { path: "customers", element: <Customers /> },
      { path: "customers/:userId", element: <CustomerDetailsPage /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
