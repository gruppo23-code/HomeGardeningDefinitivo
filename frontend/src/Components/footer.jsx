import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Mail } from 'lucide-react';

// Aggiungere questo stile
const footerStyle = `
  .font-navbar {
    font-family: 'Poppins', 'Roboto', sans-serif;
  }
  input::placeholder {
    color: white !important;
    opacity: 0.7;
  }
`;

function Footer() {
    return (
        <footer className="bg-success text-white py-5 font-navbar">
            <style>{footerStyle}</style>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h5 className="mb-3 fw-bold fs-4">Informazioni</h5>
                        <ul className="list-unstyled">
                            <li><a href="/about" className="text-white text-decoration-none fw-semibold">Chi Siamo</a></li>
                            <li><a href="/contact" className="text-white text-decoration-none fw-semibold">Contattaci</a></li>
                            <li><a href="/privacy" className="text-white text-decoration-none fw-semibold">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h5 className="mb-3 fw-bold fs-4">Seguici</h5>
                        <ul className="list-unstyled">
                            <li><a href="https://facebook.com" className="text-white text-decoration-none fw-semibold" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                            <li><a href="https://x.com" className="text-white text-decoration-none fw-semibold" target="_blank" rel="noopener noreferrer">X</a></li>
                            <li><a href="https://instagram.com" className="text-white text-decoration-none fw-semibold" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="mb-3 fw-bold fs-4">Iscriviti alla Newsletter</h5>
                        <form>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Inserisci la tua email"
                                    required
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                        '::placeholder': { color: 'white' }
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn btn-outline-light d-flex align-items-center fw-semibold">
                                <Mail className="me-2" size={20} />
                                <span>Iscriviti</span>
                            </button>
                        </form>
                    </div>
                </div>
                <hr className="my-4 border-light border-2" />
                <div className="text-center">
                    <p className="mb-0 fw-semibold">&copy; {new Date().getFullYear()} Home Gardening. Tutti i diritti riservati.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

