import React, { useState } from 'react';
import './App.css';

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
      <div className="search-container">
        <div className="logo-area">
          <h1>SİNEMA REHBERİ</h1>
        </div>
        <div className="typewriter-container">
          <p className="subtitle">Milyonlarca film ve dizi elinin altında...</p>
        </div>
        
        <form onSubmit={findMovie} className="search-form">
          <input 
            type="text" 
            placeholder="Film adı yazın (örn: Inception)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="glow-button">KEŞFET</button>
        </form>
      </div>

      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loading-text">Yükleniyor...</p>
        </div>
      )}

      {movie && !loading && (
        <div className="movie-card">
          <div className="movie-poster">
            <img 
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=Afiş+Yok"} 
              alt={movie.Title} 
            />
          </div>
          <div className="movie-info">
            <h2>{movie.Title} <span className="year">({movie.Year})</span></h2>
            <div className="rating">⭐ IMDB: {movie.imdbRating}</div>
            <div className="tags">
              <span>{movie.Runtime}</span>
              <span>{movie.Genre}</span>
            </div>
            <p className="plot"><strong>Özet:</strong> {movie.Plot}</p>
            <div className="cast">
              <p><strong>Yönetmen:</strong> {movie.Director}</p>
              <p><strong>Oyuncular:</strong> {movie.Actors}</p>
            </div>
          </div>
        </div>
      )}
      
      <footer className="footer">
        <p>Hazırlayan: Beyza Kızılay | Web Tasarım Final Projesi © 2026</p>
      </footer>
    </div>
  );
}

export default App;