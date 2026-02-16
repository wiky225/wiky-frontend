import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Repertoire() {
  const [conducteurs, setConducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); 

  useEffect(() => {
    const fetchConducteurs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/conducteurs`);
        
        if (!response.ok) {
          throw new Error('Erreur de chargement');
        }
        
        const data = await response.json();
        setConducteurs(data.data || data);
        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConducteurs();
  }, []);
 }, [location]); 

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-wiky-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des conducteurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur : {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <h1 className="section-title text-center mb-12">
          Trouvez Votre Conducteur VTC Idéal
        </h1>

        {conducteurs.length === 0 ? (
          <p className="text-center text-gray-600">Aucun conducteur disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conducteurs.map((conducteur) => (
              <Link 
                key={conducteur.id} 
                to={`/conducteur/${conducteur.id}`}
                className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-full h-48 bg-gradient-wiky rounded-t-lg flex items-center justify-center text-white text-6xl">
                  🚗
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-wiky-blue mb-2">
                    {conducteur.prenom} {conducteur.nom}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📍 {conducteur.commune}, {conducteur.quartier}</p>
                    <p>⏱️ {conducteur.annees_experience} d'expérience</p>
                    <p>🚕 {conducteur.plateformes_vtc}</p>
                  </div>

                  {conducteur.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {conducteur.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      👁️ {conducteur.vues_profil || 0} vues
                    </span>
                    <span className="text-xs text-gray-500">
                      ⭐ {conducteur.nb_favoris || 0} favoris
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}