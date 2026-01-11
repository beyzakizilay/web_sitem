import React from 'react';

const Content = ({ data }) => {
  if (!data) return null;

  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  return (
    <main className="weather-card">
      <img src={iconUrl} className="weather-animation" alt="weather-icon" />
      <h2 style={{ fontSize: '2rem', margin: '10px 0' }}>{data.name}, {data.sys.country}</h2>
      <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>{Math.round(data.main.temp)}°C</div>
      <p style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
        {data.weather[0].description}
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
        <span><strong>Nem:</strong> %{data.main.humidity}</span>
        <span><strong>Rüzgar:</strong> {data.wind.speed} km/s</span>
      </div>
    </main>
  );
};

export default Content;