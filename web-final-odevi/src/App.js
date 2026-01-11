import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("2024-12-24"); // Kesin çalışan bir tarih
  const [loading, setLoading] = useState(false);

  const API_KEY = 'sce8FYEwgxpXdIVBDoJ8S3fqROPcJcTMUwi7vcFo';

  const fetchSpaceData = useCallback(async (selectedDate) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`
      );
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Hata:", err);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    fetchSpaceData(date);
  }, [date, fetchSpaceData]);

  return (
    <div className="space-app">
      <header className="header">
        <h1>🌌 Evrenin Derinlikleri</h1>
        <p className="subtitle">NASA API ile Günün Uzay Görüntüsü</p>
        <div className="date-picker-container">
          <label>Tarih Seçin: </label>
          <input 
            type="date" 
            value={date} 
            max={new Date().toISOString().split('T')[0]} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
      </header>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Veriler hazırlanıyor...</p>
        </div>
      ) : (
        data && (
          <main className="content-card">
            <h2 className="content-title">{data.title}</h2>
            <div className="media-wrapper">
              {data.media_type === "image" ? (
                <img src={data.url} alt={data.title} className="space-image" />
              ) : (
                <div className="video-container">
                  <iframe title="space-video" src={data.url} frameBorder="0" allowFullScreen></iframe>
                </div>
              )}
            </div>
            <div className="description-section">
              <p className="explanation">{data.explanation}</p>
              <div className="meta-info">
                <span><strong>Tarih:</strong> {data.date}</span>
                {data.copyright && <span><strong>Telif:</strong> {data.copyright}</span>}
              </div>
            </div>
          </main>
        )
      )}
      <footer className="footer">
        <p>Hazırlayan: Beyza Kızılay | 2026</p>
      </footer>
    </div>
  );
}

export default App;