import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("2025-01-01"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kendi anahtarını tırnak içine yapıştırdığından emin ol
  const API_KEY = 'sce8FYEwgxpXdIVBDoJ8S3fqROPcJcTMUwi7vcFo';

  const fetchSpaceData = useCallback(async (selectedDate) => {
    setLoading(true);
    setError(null);
    
    // Zaman aşımı süresini 20 saniyeye çıkardık
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      // NASA'nın en güncel güvenli bağlantı adresini kullanıyoruz
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`NASA Sunucusu Yanıt Vermedi (Hata: ${response.status})`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("Bağlantı çok yavaş olduğu için durduruldu.");
      } else {
        setError("Veri çekilemedi. Başka bir tarih deneyin.");
      }
      
      // Eğer anahtarında sorun varsa DEMO_KEY ile son bir kez dene
      try {
        const demoRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${selectedDate}`);
        const demoData = await demoRes.json();
        setData(demoData);
        setError(null);
      } catch (e) {
        console.error("Yedekleme hatası");
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
          <label>Tarih Seç: </label>
          <input 
            type="date" 
            value={date} 
            max={new Date().toISOString().split('T')[0]} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
      </header>

      {error && <div className="error-banner" style={{background: 'red', padding: '10px', borderRadius: '5px'}}>{error}</div>}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>NASA Verileri Hazırlanıyor...</p>
        </div>
      ) : (
        data && (
          <main className="content-card">
            <h2 className="content-title">{data.title}</h2>
            <div className="media-wrapper">
              {data.media_type === "image" ? (
                <img src={data.url} alt={data.title} className="space-image" style={{maxWidth: '100%', height: 'auto'}} />
              ) : (
                <iframe title="space-video" src={data.url} className="space-video" allowFullScreen></iframe>
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