import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  // Senin aldığın aktif API anahtarı
  const API_KEY = '4a36219a'; 

  const findMovie = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      // Film araması yapıyoruz
      const response = await fetch(
        `https://www.omdbapi.com/?t=${searchTerm}&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.Response === "True") {
        setMovie(data);
      } else {
        alert("Film bulunamadı! Lütfen İngilizce adını yazmayı deneyin (örn: Inception).");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
    setLoading(false);
  };

  return (
    <div className="movie-app">
      <div className="search-container">
        <h1>Sinema Rehberi</h1>
        <p className="subtitle">Milyonlarca film ve dizi elinin altında</p>
        <form onSubmit={findMovie} className="search-form">
          <input 
            type="text" 
            placeholder="Film adı yazın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Ara</button>
        </form>
      </div>

      {loading && <div className="loader">Sinema makinesi dönüyor...</div>}

      {movie && (
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
      <footer className="footer">Beyza Kızılay | Web Final Ödevi 2026</footer>
    </div>
  );
}

export default App;