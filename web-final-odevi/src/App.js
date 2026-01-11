import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  // Başlangıçta kesinlikle verisi olan bir tarih seçiyoruz
  const [date, setDate] = useState("2025-01-01"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'sce8FYEwgxpXdIVBDoJ8S3fqROPcJcTMUwi7vcFo';

  const fetchSpaceData = useCallback(async (selectedDate) => {
    setLoading(true);
    setError(null);
    
    // Bağlantı kopmalarına karşı 15 saniyelik bir bekleme süresi tanımlıyoruz
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    try {
      // Protokolü HTTP olarak değiştirdik (Bazı ağlardaki SSL engellerini aşmak için)
      const response = await fetch(
        `http://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`NASA Hatası: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Hata detayı:", err);
      if (err.name === 'AbortError') {
        setError("Bağlantı yavaş, NASA yanıt vermedi. Lütfen internetinizi kontrol edin.");
      } else {
        setError("Veri alınırken bir sorun oluştu.");
      }

      // Eğer hata alırsak DEMO_KEY ile son bir kez deniyoruz
      try {
        const demoRes = await fetch(`http://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${selectedDate}`);
        const demoData = await demoRes.json();
        setData(demoData);
        setError(null);
      } catch (e) {
        console.log("Yedek anahtar denemesi başarısız.");
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

      {error && <div className="error-banner">{error}</div>}

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
                <div className="video-container">
                  <iframe 
                    title="space-video" 
                    src={data.url} 
                    frameBorder="0" 
                    allowFullScreen 
                    className="space-video"
                  ></iframe>
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
        <p>Beyza Kızılay | NASA Projesi 2026</p>
      </footer>
    </div>
  );
}

export default App;