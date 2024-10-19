import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Registrazione from "./pages/registrazione.jsx";
//import Dashboard from "./pages/dashboard.jsx";
//import Guide from "./pages/guide.jsx";
//import Marketplace from "./pages/marketplace.jsx";
//import Community from "./pages/community.jsx";

import Navbar from "./Components/navbar.js";


const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Home page!</div>,
    },
    {
        path: "/registrazione",
        element: <Registrazione/>,
    },
]);

function App() {
    return (
        <div>
            <Navbar/>
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;
