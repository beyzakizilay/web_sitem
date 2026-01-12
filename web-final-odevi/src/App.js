import React, { useState } from 'react';
import './App.css';
import Header from './components/Header'; 
import Content from './components/Content'; 

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '4a36219a';

  const findMovie = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${searchTerm}&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.Response === "True") {
        setMovie(data);
      } else {
        alert("Film bulunamadı! Lütfen İngilizce adını yazmayı deneyin.");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
    setLoading(false);
  };

  return (
    <div className="movie-app">
      <Header />

      <form onSubmit={findMovie} className="search-form">
        <input 
          type="text" 
          placeholder="Film adı yazın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="glow-button">KEŞFET</button>
      </form>

      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loading-text">Sinemaya bağlanılıyor...</p>
        </div>
      )}

      {!loading && <Content data={movie} />}
      
      <footer className="footer">
        <p><strong>Beyza Kızılay</strong> | Web Tasarım Final Projesi</p>
        <p className="api-info">Veriler <span>OMDb API</span> ile çekilmiştir.</p>
      </footer>
    </div>
  );
}

export default App;