import React, { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';
import VideoPlayer from './VideoPlayer'; // 1. Import your HLS player
import './Banner.css';

function Banner() {
  const [movie, setMovie] = useState([]);
  const [playVideo, setPlayVideo] = useState(false); // 2. Add local playback state hook

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      const randomIndex = Math.floor(Math.random() * request.data.results.length);
      setMovie(request.data.results[randomIndex]);
      return request;
    }
    fetchData();
  }, []);

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  }

  return (
    <header 
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center"
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="banner__buttons">
          {/* 3. Wire Play Button to turn on playback state layout */}
          <button className="banner__button" onClick={() => setPlayVideo(true)}>Play</button>
          <button className="banner__button">My List</button>
        </div>

        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="banner--fadeBottom" />

      {/* 4. Render the Fullscreen Local HLS stream overlay when active */}
      {playVideo && <VideoPlayer onClose={() => setPlayVideo(false)} />}
    </header>
  );
}

export default Banner;