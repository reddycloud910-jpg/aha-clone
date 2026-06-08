import axios from 'axios';

// Instance pointing strictly to the TMDB cloud movie server metadata catalog
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default instance;