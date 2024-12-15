import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
} from "react-router-dom";
import {useState} from "react";


//Import di pagine
import Registrazione from "./pages/registrazione.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Guide from "./pages/guide.jsx";
import Marketplace from "./pages/marketplace.jsx";
import Community from "./pages/community.jsx";
import Home from "./pages/home.jsx";
import Profilo from "./pages/profilo.jsx";

//Import di componenti
import Modal from "./Components/modal.jsx";
import Navbar from "./Components/navbar.jsx";
import Footer from "./Components/footer.jsx";

// Componente OUTLET utilizzato nelle rotte "genitore" per visualizzare le rotte "figlio"
const Comuni = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Modal />
            <div style={{ flexGrow: 1 }}> {/* Questo div occupa lo spazio disponibile */}
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

/* Funzione per la gestione del router: scelgo un percorso e gli elementi dea visualizzare al suo interno.
    Con l'ausilio del tag children posso far */
const router = createBrowserRouter([
    {
        path: "/",
        element: <Comuni/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/dashboard",
                element: <Dashboard/>,
            },
            {
                path: "/guide",
                element: <Guide/>,
            },
            {
                path: "/marketplace",
                element: <Marketplace/>,
            },
            {
                path: "/community",
                element: <Community/>,
            },
            {
                path: "/profilo",
                element: <Profilo/>,
            },
        ]
    },
    {
        path: "/registrazione",
        element: <Registrazione/>,
    },
]);

function App() {
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
}




export default App;