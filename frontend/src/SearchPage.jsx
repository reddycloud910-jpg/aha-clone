import React, { useState, useEffect } from 'react';
import axios from './axios';
import YouTube from 'react-youtube';
import './SearchPage.css';

const base_url = "https://image.tmdb.org/t/p/w500/"; // Sized perfectly for matrix card cells

function SearchPage({ query }) {
  const [results, setResults] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    if (!query) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        // Hits TMDB search multi endpoint via your working proxy path setup
        // Note: Enter your actual TMDB API key parameter inside the URL block string
        const response = await axios.get(`/search/multi?api_key=YOUR_ACTUAL_TMDB_API_KEY_STRING_HERE&query=${encodeURIComponent(query)}`);
        setResults(response.data.results || []);
      } catch (err) {
        console.error("Search error via proxy:", err);
      }
    }, 500); // 500ms Debounce: avoids hammering the network on every single character key stroke

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  const handlePosterClick = async (item) => {
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      try {
        const response = await axios.get(`/movie/${item.id}/videos?api_key=YOUR_ACTUAL_TMDB_API_KEY_STRING_HERE`);
        const trailer = response.data.results.find(vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser'));
        if (trailer) setTrailerUrl(trailer.key);
      } catch (err) {
        console.log("No trailer variant found via proxy route channels.");
      }
    }
  };

  return (
    <div className="searchPage">
      <h2>Showing results for: <span className="searchPage__queryText">{query}</span></h2>
      
      <div className="searchPage__grid">
        {results.map((item) => (
          (item.poster_path || item.backdrop_path) && (
            <div key={item.id} className="searchPage__card" onClick={() => handlePosterClick(item)}>
              <img 
                src={`${base_url}${item.poster_path || item.backdrop_path}`} 
                alt={item.title || item.name} 
              />
              <div className="searchPage__cardTitle">
                <p>{item.title || item.name || item.original_name}</p>
              </div>
            </div>
          )
        ))}
      </div>

      {trailerUrl && (
        <div className="searchPage__playerContainer">
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}
    </div>
  );
}

export default SearchPage;