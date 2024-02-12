import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

const MovieSearchApp = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (query.trim() === '') {
      setMovies([]);
      return;
    }

    const searchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    searchMovies();
  }, [query]);

  const handleMovieClick = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
      );
      setSelectedMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleAddToFavorites = (movie) => {
    setFavorites(prevFavorites => [...prevFavorites, movie]);
  };

  return (
    <div>
      <h1>Movie Search App</h1>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        {movies.map(movie => (
          <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
            <img src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title} />
            <h3>{movie.title} ({movie.release_date.slice(0, 4)})</h3>
          </div>
        ))}
      </div>
      {selectedMovie && (
        <div>
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.overview}</p>
          <p>Genres: {selectedMovie.genres.map(genre => genre.name).join(', ')}</p>
          <p>Runtime: {selectedMovie.runtime} minutes</p>
          <p>Rating: {selectedMovie.vote_average}/10</p>
          <button onClick={() => handleAddToFavorites(selectedMovie)}>Add to Favorites</button>
        </div>
      )}
      <h2>Favorites</h2>
      <ul>
        {favorites.map(favorite => (
          <li key={favorite.id}>{favorite.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieSearchApp;
