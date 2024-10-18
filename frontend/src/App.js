import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import Registrazione from "./pages/registrazione.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Guide from "./pages/guide.jsx";
import Marketplace from "./pages/marketplace.jsx";
import Community from "./pages/community.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Home page!</div>,
    },
    {
        path: "/registrazione",
        element: <Registrazione />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/guide",
        element: <Guide />,
    },
    {
        path: "/marketplace",
        element: <Marketplace />,
    },
    {
        path: "/community",
        element: <Community />,
    },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
