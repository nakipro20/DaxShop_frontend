import axios from 'axios';

const api = axios.create({
  // Esta es la ruta base de tu backend local
  baseURL: 'http://localhost:3000/', 
});

export default api;