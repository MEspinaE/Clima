// src/components/Weather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentTime, setCurrentTime] = useState('');

  const apiKey = '530476bc2a5b4c0984c165744242510'; // Tu API key

  const fetchWeather = async (cityQuery) => {
    if (!cityQuery) return;

    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityQuery}&days=2`);
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('No se pudo encontrar la ciudad. Intenta de nuevo.');
      setWeatherData(null);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
      setSuggestions(response.data);
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
    setSuggestions([]); // Limpiar las sugerencias al buscar
  };

  const handleChange = (e) => {
    setCity(e.target.value);
    if (e.target.value) {
      fetchSuggestions(e.target.value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cityQuery = `${suggestion.name}, ${suggestion.country}`;
    setCity(cityQuery);
    fetchWeather(cityQuery); // Llama a fetchWeather inmediatamente
    setSuggestions([]);
  };

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleString());
  };

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-container">
      <h2>Aplicación de Clima</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa una ciudad"
          value={city}
          onChange={handleChange}
        />
        <button type="submit">Buscar</button>
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h3>
            {weatherData.location.name}, {weatherData.location.country}
          </h3>
          <p>Temperatura Actual: {weatherData.current.temp_c} °C</p>
          <p>Máxima: {weatherData.forecast.forecastday[0].day.maxtemp_c} °C</p>
          <p>Mínima: {weatherData.forecast.forecastday[0].day.mintemp_c} °C</p>
          <p>Estado Actual: {weatherData.current.condition.text}</p>
          <img src={weatherData.current.condition.icon} alt="icono del clima" />

          <h4>Pronóstico para mañana</h4>
          <p>Temperatura Máxima: {weatherData.forecast.forecastday[1].day.maxtemp_c} °C</p>
          <p>Temperatura Mínima: {weatherData.forecast.forecastday[1].day.mintemp_c} °C</p>
          <p>Estado: {weatherData.forecast.forecastday[1].day.condition.text}</p>
          <img src={weatherData.forecast.forecastday[1].day.condition.icon} alt="icono del clima" />
        </div>
      )}
      <div className="clock">
        <p>{currentTime}</p>
      </div>
      <footer className="signature">
        <p>Marco Espina</p>
      </footer>
    </div>
  );
};

export default Weather;
