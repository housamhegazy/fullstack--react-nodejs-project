import { createBrowserRouter, RouterProvider } from "react-router-dom"; // <--- هذا هو الاستيراد الصحيح والوحيد لحزمة التوجيه
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Edite from "./pages/Edite";
import Search from "./pages/Search";
import View from "./pages/View";
import AddCustomer from "./pages/AddCustomer";
import Root from "./Root";
import Err_404Page from "./pages/Err_404Page";
import Signin from "./pages/signin";
import SignUp from "./pages/register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: Home },
        { path: "profile", Component: Profile },
        { path: "edite/:id", Component: Edite },
        { path: "search", Component: Search },
        { path: "view/:id", Component: View },
        { path: "addCustomer", Component: AddCustomer },
        { path: "signin", Component: Signin },
        { path: "register", Component: SignUp },
        { path: "*", Component: Err_404Page },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
