import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'sce8FYEwgxpXdIVBDoJ8S3fqROPcJcTMUwi7vcFo';
  const fetchSpaceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpaceData();
  }, [date]);

  return (
    <div className="space-app">
      <header className="header">
        <h1>🌌 Evrenin Derinlikleri</h1>
        <p>NASA API ile Günün Uzay Görüntüsü</p>
        <div className="date-picker-container">
          <label htmlFor="date">Bir Tarih Seçin: </label>
          <input 
            id="date"
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
          <p>Yıldız tozları toplanıyor...</p>
        </div>
      ) : (
        data && (
          <main className="content-card">
            <h2 className="content-title">{data.title}</h2>
            
            <div className="media-wrapper">
              {data.media_type === "image" ? (
                <img src={data.url} alt={data.title} className="space-image" />
              ) : (
                <iframe 
                  title="space-video" 
                  src={data.url} 
                  frameBorder="0" 
                  allowFullScreen 
                  className="space-video"
                ></iframe>
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