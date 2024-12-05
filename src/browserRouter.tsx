import {
  createBrowserRouter,
  Outlet,
  useHref,
  useNavigate,
} from "react-router-dom";
import { Staff } from "./pages/Staff";
import { NextUIProvider } from "@nextui-org/react";
import { Spin } from "./pages/Spin";
import { Home } from "./pages/Home";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = () => {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <Outlet />
    </NextUIProvider>
  );
};

export const browserRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/spin",
        element: <Spin />,
      },
      {
        path: "/staffs",
        element: <Staff />,
      },
    ],
  },
]);
