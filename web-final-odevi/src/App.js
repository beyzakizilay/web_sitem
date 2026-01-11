import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("2024-12-01"); // Kesin veri olan bir tarih
  const [loading, setLoading] = useState(false);

  const API_KEY = 'sce8FYEwgxpXdIVBDoJ8S3fqROPcJcTMUwi7vcFo';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Hata oluştu:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [date]);

  return (
    <div className="container">
      <header className="header">
        <h1>🌌 Evrenin Derinlikleri</h1>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="date-input"
        />
      </header>

      {loading ? (
        <div className="loader">Yükleniyor...</div>
      ) : (
        data && (
          <div className="card">
            <h2 className="title">{data.title}</h2>
            <div className="image-container">
              {data.media_type === "image" ? (
                <img src={data.url} alt="NASA" className="main-img" />
              ) : (
                <iframe src={data.url} title="video" className="video" />
              )}
            </div>
            <p className="desc">{data.explanation}</p>
            <div className="footer-info">Tarih: {data.date}</div>
          </div>
        )
      )}
      <footer className="dev-footer">Hazırlayan: Beyza Kızılay | 2026</footer>
    </div>
  );
}

export default App;