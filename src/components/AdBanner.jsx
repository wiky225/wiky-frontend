import { useEffect, useRef, useState } from 'react';

import API_URL from '../lib/api.js';

const FORMAT_SIZES = {
  medium_rectangle: { width: 300, height: 250 },
  leaderboard:      { width: 728, height: 90 },
  mobile_banner:    { width: 320, height: 50 },
  half_page:        { width: 300, height: 600 },
};

export default function AdBanner({ position, className = '' }) {
  const [annonce, setAnnonce] = useState(null);
  const impressionFired = useRef(false);

  useEffect(() => {
    fetch(`${API_URL}/api/annonces?position=${encodeURIComponent(position)}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnonce(data[Math.floor(Math.random() * data.length)]);
        }
      })
      .catch(() => {});
  }, [position]);

  // Comptage impression (une seule fois par affichage)
  useEffect(() => {
    if (annonce && !impressionFired.current) {
      impressionFired.current = true;
      fetch(`${API_URL}/api/annonces/${annonce.id}/impression`, { method: 'POST' }).catch(() => {});
    }
  }, [annonce]);

  if (!annonce) return null;

  const size = FORMAT_SIZES[annonce.format] || FORMAT_SIZES.medium_rectangle;

  const handleClic = () => {
    fetch(`${API_URL}/api/annonces/${annonce.id}/clic`, { method: 'POST' }).catch(() => {});
  };

  const img = (
    <img
      src={annonce.image_url}
      alt={`Publicité ${annonce.annonceur}`}
      style={{ width: size.width, height: size.height, maxWidth: '100%' }}
      className="rounded shadow-sm"
    />
  );

  return (
    <div className={`flex flex-col items-center py-3 ${className}`}>
      <span className="text-xs text-gray-400 mb-1">Publicité</span>
      {annonce.lien_url ? (
        <a href={annonce.lien_url} target="_blank" rel="noopener noreferrer nofollow" onClick={handleClic}>
          {img}
        </a>
      ) : img}
    </div>
  );
}
