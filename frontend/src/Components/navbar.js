import React from "react";
import LoginButton from './bottone_login.js';
import {Link} from "react-router-dom";


function Navbar() {
    return (
        <nav className="navbar bg-light"> {/* Navbar */}
            <div className="container-fluid d-flex">
                <div className="col">
                    <Link to={"/"} className="text-decoration-none text-black">
                        <span className="navbar-brand m-1 h1 text-black">
                            Home Gardening
                        </span>
                    </Link>
                </div>
                {/* d-none d-lg-block : nascondo su schermi più piccoli di lg, ovvero < 992px */}
                {/* Neccessario poichè su schermi piccoli la visualizzazione non è ottimale*/}
                <div className="container col-4 d-flex m-1 w-auto d-none d-lg-block">
                    <Link to={"/Dashboard"} className="text-decoration-none text-black">
                        <h6>Dashboard</h6>
                    </Link>
                </div>
                <div className="container col-4 d-flex m-1 w-auto d-none d-lg-block">
                    <Link to={"/Guide"} className="text-decoration-none text-black">
                        <h6>Guide di coltivazione</h6>
                    </Link>
                </div>
                <div className="container col-4 d-flex m-1 w-auto d-none d-lg-block">
                    <Link to={"/Marketplace"} className="text-decoration-none text-black">
                        <h6>Marketplace</h6>
                    </Link>
                </div>
                <div className="container col-4 d-flex m-1 w-auto d-none d-lg-block">
                    <Link to={"/Community"} className="text-decoration-none text-black">
                        <h6>Community</h6>
                    </Link>
                </div>
                <div className="container col-4 d-flex m-1 w-auto ms-3 d-none d-lg-block">
                    <LoginButton/>
                </div>

                {/* Dropdown visualizzato da dispositivi con schermo inferiore a 992px */}
                {/* Mediante la classe d-lg-none che mostra questa componente solo per schermi di tale grandezza*/}
                <div className="dropdown d-lg-none">
                    <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Menù
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                        <li>
                            <LoginButton/>
                        </li>
                        <li>
                            <hr className="dropdown-divider"/>
                        </li>
                        <li className="ps-3 pt-1">
                            <Link to={"/Dashboard"} className="text-decoration-none text-black">
                                <h6>Dashboard</h6>
                            </Link>
                        </li>
                        <li className="ps-3 pt-1">
                            <Link to={"/Guide"} className="text-decoration-none text-black">
                                <h6>Guide</h6>
                            </Link>
                        </li>
                        <li className="ps-3 pt-1">
                            <Link to={"/Marketplace"} className="text-decoration-none text-black">
                                <h6>Marketplace</h6>
                            </Link>
                        </li>
                        <li className="ps-3 pt-1">
                            <Link to={"/Community"} className="text-decoration-none text-black">
                                <h6>Community</h6>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;