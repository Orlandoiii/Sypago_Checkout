import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ThemeProvider } from "./ui/core/config/ThemeProvider";


import CheckoutPage from "./ui/pages/CheckoutPage";
import ErrorPage from "./ui/components/Error/ErrorPage";
import NotFoundComponent from "./ui/core/not-found/NotFoundPage";
import ConfigContextProvider from "./ui/contexts/ConfigContext";

const router = createBrowserRouter([

  {
    path: "/bitmercado/checkout/",
    element: <CheckoutPage isBlueprint={false} />,
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
        <ConfigContextProvider>
          <RouterProvider router={router} />
        </ConfigContextProvider>
      </ThemeProvider>
    </>

  )
}

export default App
