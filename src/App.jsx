import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";




import CheckoutPage from "./ui/pages/CheckoutPage";


const router = createBrowserRouter([
  {
    path: "/checkout/:id",
    element: <CheckoutPage isBlueprint={false} />,
  },
  {
    path: "/checkout/blueprint/:id",
    element: <CheckoutPage isBlueprint={true} />,
  },

]);



function App() {

  // useEffect(() => {
  //   if (isMobile) {
  //     // Lock to portrait-primary (or any other value)
  //     screen.orientation.lock('portrait-primary');

  //     // Clean up the lock on component unmount
  //     return () => screen.orientation.unlock();
  //   }
  // }, [])

  return (


    <>
      <RouterProvider router={router} />
    </>

  )
}

export default App
