import React, { useState } from 'react';
import { Sun, Cloud, Droplets, Wind, MessageCircle, X } from 'lucide-react';
import './css/home.css';

function Home() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [weather, setWeather] = useState({
        temperature: '--',
        humidity: '--',
        condition: '--',
        windSpeed: '--'
    });

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title">
                                Coltiva il tuo giardino ideale con Home Gardening
                            </h1>
                            <p className="hero-subtitle">
                                Unisciti alla nostra community di appassionati di giardinaggio.
                                Monitora le tue piante, ricevi consigli personalizzati e condividi
                                la tua esperienza verde.
                            </p>
                            <div className="hero-buttons">
                                <button className="btn btn-success btn-lg me-3">
                                    Inizia Gratuitamente
                                </button>
                                <button className="btn btn-outline-success btn-lg">
                                    Scopri di più
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img
                                src="/placeholder.svg?height=400&width=600"
                                alt="Giardinaggio"
                                className="hero-image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">
                        Perché scegliere Home Gardening?
                    </h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img
                                        src="/placeholder.svg?height=80&width=80"
                                        alt="Monitoraggio piante"
                                    />
                                </div>
                                <h3>Monitoraggio Intelligente</h3>
                                <p>
                                    Tieni traccia della crescita delle tue piante e ricevi
                                    notifiche personalizzate per la loro cura.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img
                                        src="/placeholder.svg?height=80&width=80"
                                        alt="Community"
                                    />
                                </div>
                                <h3>Community Attiva</h3>
                                <p>
                                    Connettiti con altri appassionati, condividi consigli
                                    e scopri nuove tecniche di giardinaggio.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img
                                        src="/placeholder.svg?height=80&width=80"
                                        alt="Guida esperta"
                                    />
                                </div>
                                <h3>Guida Esperta</h3>
                                <p>
                                    Accedi a guide dettagliate e consigli di esperti per
                                    ogni tipo di pianta.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weather Widget */}
            <div className="weather-widget">
                <div className="weather-header">
                    <Sun className="weather-icon" size={24} />
                    <h4>Meteo Locale</h4>
                </div>
                <div className="weather-content">
                    <div className="weather-info">
                        <div className="weather-stat">
                            <Sun size={20} />
                            <span>{weather.temperature}°C</span>
                        </div>
                        <div className="weather-stat">
                            <Cloud size={20} />
                            <span>{weather.condition}</span>
                        </div>
                        <div className="weather-stat">
                            <Droplets size={20} />
                            <span>{weather.humidity}%</span>
                        </div>
                        <div className="weather-stat">
                            <Wind size={20} />
                            <span>{weather.windSpeed} km/h</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chatbot Widget */}
            <div className={`chatbot-widget ${showChatbot ? 'open' : ''}`}>
                {showChatbot ? (
                    <div className="chatbot-container">
                        <div className="chatbot-header">
                            <h4>Assistente Virtuale</h4>
                            <button
                                className="btn-close-chat"
                                onClick={() => setShowChatbot(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="chatbot-messages">
                            {/* Qui verranno renderizzati i messaggi del chatbot */}
                            <div className="message bot">
                                Ciao! Come posso aiutarti con il tuo giardino oggi?
                            </div>
                        </div>
                        <div className="chatbot-input">
                            <input
                                type="text"
                                placeholder="Scrivi un messaggio..."
                                className="form-control"
                            />
                            <button className="btn btn-success">Invia</button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="chatbot-trigger"
                        onClick={() => setShowChatbot(true)}
                    >
                        <MessageCircle size={24} />
                        <span>Hai bisogno di aiuto?</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Home;

