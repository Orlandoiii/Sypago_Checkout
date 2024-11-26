import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ThemeProvider } from "./ui/core/config/ThemeProvider";


import CheckoutPage from "./ui/pages/CheckoutPage";
import ErrorPage from "./ui/components/Error/ErrorPage";
import NotFoundComponent from "./ui/core/not-found/NotFoundPage";
import LoginForm from "./ui/components/Login/LoginForm";

const router = createBrowserRouter([
  {
    path: "/digitel",
    element: <CheckoutPage isBlueprint={false} />,
    errorElement: <ErrorPage />
  },
  {
    path: "/digitel/:id",
    element: <CheckoutPage isBlueprint={false} />,
    errorElement: <ErrorPage />
  },
  {
    path: "/digitel/blueprint/:id",
    element: <CheckoutPage isBlueprint={true} />,
    errorElement: <ErrorPage />
  },
  {
    path: "*",
    element: <NotFoundComponent />,
    errorElement: <ErrorPage />
  }

]);



function App() {

  return (
    <>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>

  )
}

export default App
