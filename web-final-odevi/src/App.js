import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';

function App() {
  const [city, setCity] = useState('Ankara'); 
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Senin API Anahtarın
  const API_KEY = "3adf9c89d798a8f7847571d266ede518"; 

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=tr`
      );
      if (!response.ok) throw new Error("Şehir bulunamadı!");
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <div className={`app-container ${weatherData ? weatherData.weather[0].main.toLowerCase() : ''}`}>
      <Header />
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Şehir giriniz ve Enter'a basın..." 
          onKeyPress={(e) => e.key === 'Enter' && fetchWeather(e.target.value)}
        />
      </div>
      {loading && <p className="status">Yükleniyor...</p>}
      {error && <p className="status error">{error}</p>}
      <Content data={weatherData} />
      <Footer />
    </div>
  );
}

export default App;