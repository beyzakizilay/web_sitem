import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("2025-01-01"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'sce8FYEwgxpXdIVBDoJ8S3fqROPcJcTMUwi7vcFo';

  const fetchSpaceData = useCallback(async (selectedDate) => {
    setLoading(true);
    setError(null);
    
    // Zaman aşımı kontrolü (Aborting)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 saniye sonra iptal et

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`NASA Hatası: ${response.status} - Veri henüz yüklenmemiş olabilir.`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("Bağlantı zaman aşımına uğradı. NASA sunucusu şu an yavaş olabilir.");
      } else {
        setError(err.message);
      }
      // Hata durumunda DEMO_KEY ile son bir kez dene
      try {
        const demoRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${selectedDate}`);
        const demoData = await demoRes.json();
        setData(demoData);
        setError(null);
      } catch (e) {
        console.error("Yedek anahtar da başarısız.");
      }
    } finally {
      clearTimeout(timeoutId);
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

      {error && <div className="error-banner">{error} - Başka bir tarih seçiniz.</div>}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>NASA Arşivine bağlanılıyor...</p>
        </div>
      ) : (
        data && (
          <main className="content-card">
            <h2 className="content-title">{data.title}</h2>
            <div className="media-wrapper">
              {data.media_type === "image" ? (
                <img src={data.url} alt={data.title} className="space-image" />
              ) : (
                <iframe title="space-video" src={data.url} className="space-video" frameBorder="0" allowFullScreen></iframe>
              )}
            </div>
            <div className="description-section">
              <p className="explanation">{data.explanation}</p>
              <div className="meta-info">
                <span><strong>Tarih:</strong> {data.date}</span>
              </div>
            </div>
          </main>
        )
      )}
    </div>
  );
}

export default App;