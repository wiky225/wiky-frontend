const API_URL = import.meta.env.VITE_API_URL || 'https://wiky-backend.onrender.com';

if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
  console.warn('[config] VITE_API_URL non défini, utilisation du fallback:', API_URL);
}

export default API_URL;
