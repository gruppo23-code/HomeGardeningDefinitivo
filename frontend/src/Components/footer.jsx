import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
    return (
        <>
            <footer className="footer bg-light text-dark">
                <div className="container pt-5">
                    <div className="row">
                        <div className="col-md-4">
                            <h5>Informazioni</h5>
                            <ul className="list-unstyled">
                                <li><a href="/about" className="text-dark">Chi Siamo</a></li>
                                <li><a href="/contact" className="text-dark">Contattaci</a></li>
                                <li><a href="/privacy" className="text-dark">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h5>Seguici</h5>
                            <ul className="list-unstyled">
                                <li><a href="https://facebook.com" className="text-dark" target="_blank"
                                       rel="noopener noreferrer">Facebook</a></li>
                                <li><a href="https://twitter.com" className="text-dark" target="_blank"
                                       rel="noopener noreferrer">Twitter</a></li>
                                <li><a href="https://instagram.com" className="text-dark" target="_blank"
                                       rel="noopener noreferrer">Instagram</a></li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h5>Iscriviti alla Newsletter</h5>
                            <form>
                                <div className="mb-1">
                                    <input type="email" placeholder="Inserisci la tua email" className="form-control"
                                           required/>
                                </div>
                                <button type="submit" className="btn btn-primary">Iscriviti</button>
                            </form>
                        </div>
                    </div>
                    <hr className="my-4"/>
                    <div className="text-center">
                        <p>&copy; {new Date().getFullYear()} La Tua Web App. Tutti i diritti riservati.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;