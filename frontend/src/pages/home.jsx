import React from "react";
import './css/home.css';
import rosaImage from '../img/rosa.jpg';
import girasoleImage from '../img/girasole.jpg';
import orchideaImg from '../img/orchidea.jpg';

function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Benvenuto nel tuo Giardino Digitale!</h1>
                <p>Coltiva le tue piante e osserva il tuo giardino crescere.</p>
            </header>
            <section className="garden-section">
                <h2>Le tue piante</h2>
                <div className="plant-cards">
                    <div className="plant-card">
                        <img src={rosaImage} alt="Rosa" className="rosa-img" />
                        <h3>Rosa</h3>
                        <p>Una pianta bellissima e profumata.</p>
                    </div>
                    <div className="plant-card">
                        <img src={girasoleImage} alt="Girasole" className="girasole-img" />
                        <h3>Girasole</h3>
                        <p>Un fiore che segue il sole!</p>
                    </div>
                    <div className="plant-card">
                        <img src={orchideaImg} alt="Orchidea" className="orchidea-img" />
                        <h3>Orchidea</h3>
                        <p>Elegante e raffinata.</p>
                    </div>
                </div>
            </section>
            <footer className="home-footer">
                <p>Inizia a coltivare il tuo giardino digitale oggi stesso!</p>
            </footer>
        </div>
    );
}

export default Home;