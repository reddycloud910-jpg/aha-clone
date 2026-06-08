import React, { useState, useEffect } from 'react';
import axios from './axios';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import './Row.css';

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  // Settings configuration for the react-youtube player component
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1, // Automatically plays the trailer when it loads up
    },
  };

  const handleClick = (movie) => {
    // If a trailer player is already open, clicking a poster will close it
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      // Find the trailer using the movie name or title string
      const movieName = movie?.title || movie?.name || movie?.original_name || "";
      movieTrailer(movieName)
        .then((url) => {
          // Extracts the video ID at the end of the YouTube URL link
          // e.g., https://www.youtube.com/watch?v=XtMThy8QKqU -> XtMThy8QKqU
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get('v'));
        })
        .catch((error) => console.log("Trailer lookup failed or unavailable:", error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      
      <div className="row__posters">
        {movies.map((movie) => (
          ((isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) && (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)} // 1. Trigger click action
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              alt={movie.name || movie.title || movie.original_name}
            />
          )
        ))}
      </div>
      
      {/* 2. Render the YouTube player conditionally below the row if a video ID exists */}
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;