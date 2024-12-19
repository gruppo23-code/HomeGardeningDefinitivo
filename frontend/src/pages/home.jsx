import React, { useState } from 'react';
import { Sun, Cloud, CloudDrizzle, CloudRain, Snowflake, CloudRainWind ,Droplets, Wind, MessageCircle, X } from 'lucide-react';
import './css/home.css';
import axios from "axios";
import Cookies from "js-cookie";

function Home() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [weather, setWeather] = useState({
        temperature: '--',
        humidity: '--',
        condition: '--',
        windSpeed: '--'
    });
    const [weatherCode, setWeatherCode] = useState('');

    const richiestaMeteo = async () => {
        try {
            //Recupero latitudine e longitudine dell'utente
            const latLong = await axios.get("http://localhost:8081/latlong");
            //console.log(latLong.data);
            const response = await axios.get('http://localhost:8081/api/weather', {
                params: {
                    latitude: latLong.data.latitudine,
                    longitude: latLong.data.longitudine,
                },
            });
            //console.log(response.data.current);
            setWeather({
                temperature: response.data.current.temperature_2m,
                humidity: response.data.current.relative_humidity_2m,
                condition: response.data.current.cloud_cover,
                windSpeed: response.data.current.wind_speed_10m,
            })
            setWeatherCode(response.data.current.weather_code);
        } catch (err) {
            console.error(err);
        }
    };
    window.onload = richiestaMeteo;

    const isLoggedIn = () => {
        const token = Cookies.get('token');
        return !!token;
    };


// All'interno del componente Home, aggiungi questi nuovi stati
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Ciao! Come posso aiutarti con il tuo giardino oggi?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

// Aggiungi questa funzione per gestire l'invio dei messaggi
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage = {
            role: 'user',
            content: inputMessage
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8081/api/chat', {
                messages: [...messages, newMessage]
            });

            const botResponse = {
                role: 'assistant',
                content: response.data.message
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Errore durante l\'invio del messaggio:', error);

            const errorMessage = {
                role: 'assistant',
                content: 'Mi dispiace, si è verificato un errore. Riprova più tardi.'
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="home-hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="home-hero-title">
                                Coltiva il tuo giardino ideale con Home Gardening
                            </h1>
                            <p className="home-hero-subtitle">
                                Unisciti alla nostra community di appassionati di giardinaggio.
                                Monitora le tue piante, ricevi consigli personalizzati e condividi
                                la tua esperienza verde.
                            </p>
                            <div className="home-hero-buttons">
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
                                className="home-hero-image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="home-features-section">
                <div className="container">
                    <h2 className="home-section-title text-center mb-5">
                        Perché scegliere Home Gardening?
                    </h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="home-feature-card">
                                <div className="home-feature-icon">
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
                            <div className="home-feature-card">
                                <div className="home-feature-icon">
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
                            <div className="home-feature-card">
                                <div className="home-feature-icon">
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
            {isLoggedIn() && (
                <div className="home-weather-widget">
                    <div className="home-weather-header">
                        <div className="home-weather-header">
                            {weatherCode >= 0 && weatherCode <= 49 && <Sun className="home-weather-icon" size={24}/>}
                            {weatherCode >= 50 && weatherCode <= 59 && <CloudDrizzle className="home-weather-icon" size={24}/>}
                            {weatherCode >= 60 && weatherCode <= 69 && <CloudRain className="home-weather-icon" size={24}/>}
                            {weatherCode >= 70 && weatherCode <= 79 && <Snowflake className="home-weather-icon" size={24}/>}
                            {weatherCode >= 80 && weatherCode <= 99 && <CloudRainWind className="home-weather-icon" size={24}/>}
                            <h4>Meteo Locale</h4>
                        </div>
                    </div>
                    <div className="home-weather-content">
                        <div className="home-weather-info">
                            <div className="home-weather-stat">
                                <Sun size={20}/>
                                <span>{weather.temperature}°C</span>
                            </div>
                            <div className="home-weather-stat">
                                <Cloud size={20}/>
                                <span>{weather.condition}</span>
                            </div>
                            <div className="home-weather-stat">
                                <Droplets size={20} />
                                <span>{weather.humidity}%</span>
                            </div>
                            <div className="home-weather-stat">
                                <Wind size={20} />
                                <span>{weather.windSpeed} km/h</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chatbot Widget */}
            <div className={`home-chatbot-widget ${showChatbot ? 'open' : ''}`}>
                {showChatbot ? (
                    <div className="home-chatbot-container">
                        <div className="home-chatbot-header">
                            <h4>Assistente Virtuale</h4>
                            <button
                                className="home-btn-close-chat"
                                onClick={() => setShowChatbot(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="home-chatbot-messages">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`home-message ${message.role === 'assistant' ? 'bot' : 'user'}`}
                                >
                                    {message.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="home-message bot">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="home-chatbot-input">
                            <input
                                type="text"
                                placeholder="Scrivi un messaggio..."
                                className="form-control"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <button
                                className="btn btn-success"
                                onClick={handleSendMessage}
                                disabled={isLoading}
                            >
                                Invia
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="home-chatbot-trigger"
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

