import React, { forwardRef } from "react";
import { User, LogIn } from 'lucide-react';
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const LoginButton = forwardRef((props, ref) => {
    const isLoggedIn = () => {
        const token = Cookies.get('token');
        return !!token;
    };

    const handleLogout = (e) => {
        e.preventDefault();
        Cookies.remove('token');
        window.location.reload();
    };

    if (isLoggedIn()) {
        return (
            <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white mx-3 d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    <User className="me-2" size={24} strokeWidth={2} />
                    <span>Profilo</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                        <Link to="/Profilo" className="dropdown-item">
                            Profilo
                        </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <a className="dropdown-item text-danger" href="/" onClick={handleLogout}>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <div
            className="nav-link text-white mx-3 d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
            ref={ref}
            style={{ cursor: 'pointer', fontSize: '1.1rem', fontWeight: 500 }}
        >
            <LogIn className="me-2" size={24} strokeWidth={2} />
            <span>Accedi</span>
        </div>
    );
});

export default LoginButton;

