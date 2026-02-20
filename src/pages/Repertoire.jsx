import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Repertoire() {
  const [conducteurs, setConducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConducteurs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/conducteurs`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        const data = await response.json();
        setConducteurs(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConducteurs();
  }, []);

  if (loading) {
    return <div className="container-custom py-20 text-center">Chargement des conducteurs...</div>;
  }

  if (error) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-red-600">Erreur : {error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-wiky-blue mb-8">Répertoire des Conducteurs VTC</h1>
        
        <AdBanner position="repertoire-inline" className="mb-6" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conducteurs.map((conducteur) => (
            <Link
              key={conducteur.id}
              to={`/conducteur/${conducteur.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={conducteur.photo_url || `https://ui-avatars.com/api/?name=${conducteur.prenom}+${conducteur.nom}&size=300&background=253b56&color=fff`}
                alt={`${conducteur.prenom} ${conducteur.nom}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-wiky-blue">{conducteur.prenom} {conducteur.nom}</h3>
                <p className="text-gray-600">{conducteur.commune}</p>
                <p className="text-sm text-gray-500 mt-2">⏱️ {conducteur.annees_experience}</p>
                {conducteur.description && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{conducteur.description}</p>
                )}
                <div className="mt-4 flex justify-end">
                  <span className="text-wiky-orange font-semibold">Voir profil →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {conducteurs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600">Aucun conducteur disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}