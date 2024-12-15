import React from "react";
import LoginButton from './bottone_login.jsx';
import { Link, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { Leaf, BookOpen, ShoppingBag, Users, LayoutDashboard } from 'lucide-react';

function Navbar() {
    const buttonRef = React.useRef(null);
    const location = useLocation();

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('showModal') === 'true') {
            if (buttonRef.current) {
                buttonRef.current.click();
            }
        }
    }, [location]);

    const isLoggedIn = () => {
        const token = Cookies.get('token');
        return !!token;
    };

    const alertClick = () => {
        alert("Accesso Negato. Devi essere loggato per accedere alla Dashboard.");
    };

    return (
        <nav className="navbar" style={{
            backgroundColor: '#2E7D32',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            padding: '0.5rem 1rem',
        }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center text-white">
                    <Leaf className="me-2" size={32} strokeWidth={2.5} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>Home Gardening</span>
                </Link>
                <div className="d-none d-lg-flex align-items-center">
                    {isLoggedIn() ? (
                        <Link to="/Dashboard" className="nav-link text-white mx-3 d-flex align-items-center">
                            <LayoutDashboard className="me-2" size={24} strokeWidth={2} />
                            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Dashboard</span>
                        </Link>
                    ) : (
                        <span className="nav-link text-white mx-3 d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={alertClick}>
                            <LayoutDashboard className="me-2" size={24} strokeWidth={2} />
                            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Dashboard</span>
                        </span>
                    )}
                    <Link to="/Guide" className="nav-link text-white mx-3 d-flex align-items-center">
                        <BookOpen className="me-2" size={24} strokeWidth={2} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Guide</span>
                    </Link>
                    <Link to="/Marketplace" className="nav-link text-white mx-3 d-flex align-items-center">
                        <ShoppingBag className="me-2" size={24} strokeWidth={2} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Marketplace</span>
                    </Link>
                    <Link to="/Community" className="nav-link text-white mx-3 d-flex align-items-center">
                        <Users className="me-2" size={24} strokeWidth={2} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Community</span>
                    </Link>
                    <LoginButton className="btn btn-outline-light ms-3" style={{ fontSize: '1rem', fontWeight: 500 }} />
                </div>

                <div className="dropdown d-lg-none">
                    <button className="btn btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '1rem', fontWeight: 500 }}>
                        Menu
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton" style={{ backgroundColor: '#2E7D32' }}>
                        <li><LoginButton ref={buttonRef} className="dropdown-item text-white" style={{ fontSize: '1rem', fontWeight: 500 }} /></li>
                        <li><hr className="dropdown-divider" style={{ borderColor: 'rgba(255,255,255,0.2)' }} /></li>
                        <li><Link to="/Dashboard" className="dropdown-item text-white" style={{ fontSize: '1rem', fontWeight: 500 }}>Dashboard</Link></li>
                        <li><Link to="/Guide" className="dropdown-item text-white" style={{ fontSize: '1rem', fontWeight: 500 }}>Guide</Link></li>
                        <li><Link to="/Marketplace" className="dropdown-item text-white" style={{ fontSize: '1rem', fontWeight: 500 }}>Marketplace</Link></li>
                        <li><Link to="/Community" className="dropdown-item text-white" style={{ fontSize: '1rem', fontWeight: 500 }}>Community</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;

