import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css'; // Corrected the extension mismatch from the previous step (.css instead of .jsx)

function VideoPlayer({ onClose }) {
  const videoRef = useRef(null);
  
  // NEW: Using a public, high-quality HLS test stream asset (Big Buck Bunny)
  const streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.log("Autoplay blocked:", err));
      });

      return () => {
        hls.destroy(); 
      };
    } 
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }, []);

  return (
    <div className="videoPlayer__overlay">
      <button className="videoPlayer__backBtn" onClick={onClose}>
        ← Back to Browse
      </button>

      <video 
        ref={videoRef} 
        className="videoPlayer__video" 
        controls 
        autoPlay
      />
    </div>
  );
}

export default VideoPlayer;