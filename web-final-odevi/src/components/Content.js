import React from 'react';

const Content = ({ data }) => {
  if (!data) return null;

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img 
          src={data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x450?text=Afiş+Yok"} 
          alt={data.Title} 
        />
      </div>
      <div className="movie-info">
        <h2>{data.Title} <span className="year">({data.Year})</span></h2>
        <div className="rating">⭐ IMDB: {data.imdbRating}</div>
        <div className="tags">
          <span>{data.Runtime}</span>
          <span>{data.Genre}</span>
        </div>
        <p className="plot"><strong>Özet:</strong> {data.Plot}</p>
        <div className="cast">
          <p><strong>Yönetmen:</strong> {data.Director}</p>
          <p><strong>Oyuncular:</strong> {data.Actors}</p>
        </div>
      </div>
    </div>
  );
};

export default Content;