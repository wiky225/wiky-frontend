import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FORMAT_SIZES = {
  medium_rectangle: { width: 300, height: 250 },
  leaderboard:      { width: 728, height: 90 },
  mobile_banner:    { width: 320, height: 50 },
  half_page:        { width: 300, height: 600 },
};

export default function AdBanner({ position, className = '' }) {
  const [annonce, setAnnonce] = useState(null);

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

  if (!annonce) return null;

  const size = FORMAT_SIZES[annonce.format] || FORMAT_SIZES.medium_rectangle;

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
        <a href={annonce.lien_url} target="_blank" rel="noopener noreferrer nofollow">
          {img}
        </a>
      ) : img}
    </div>
  );
}
