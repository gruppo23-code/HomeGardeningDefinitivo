// src/components/App2.js
import React, { useState } from "react";

export const api = {
    key: "c2d859fe0119442c86d181248242411",
    base: "https://www.weatherapi.com/api-explorer.aspx"
};

export default function App2() {
    const [search, setSearch] = useState("");
    const [weather, setWeather] = useState(null); // Cambiato per gestire l'assenza di dati

    const searchPressed = () => {
        if (!search) return;
        fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.cod === 200) {
                    setWeather(result);
                } else {
                    alert("Città non trovata!");
                }
            });
    };

    return (
        <div className="weather-card">
            <h1>Weather App</h1>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Inserisci la città/paese..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={searchPressed}>Cerca</button>
            </div>
            {weather && (
                <div className="weather-info">
                    <h2>{weather.name}</h2>
                    <p>Temperatura: {weather.main.temp}°C</p>
                    <p>Condizioni: {weather.weather[0].main}</p>
                    <p>Descrizione: {weather.weather[0].description}</p>
                </div>
            )}
        </div>
    );
}
