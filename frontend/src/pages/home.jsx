import React from "react";
import './css/home.css'; // Assicurati di avere uno stile per il tuo componente

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
                        <img src="link-alla-tua-immagine-rosa.jpg" alt="Rosa" className="plant-image" />
                        <h3>Rosa</h3>
                        <p>Una pianta bellissima e profumata.</p>
                    </div>
                    <div className="plant-card">
                        <img src="link-alla-tua-immagine-girasole.jpg" alt="Girasole" className="plant-image" />
                        <h3>Girasole</h3>
                        <p>Un fiore che segue il sole!</p>
                    </div>
                    <div className="plant-card">
                        <img src="link-alla-tua-immagine-orchidea.jpg" alt="Orchidea" className="plant-image" />
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