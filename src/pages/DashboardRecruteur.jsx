import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function DashboardRecruteur() {
  const { session } = useAuth();
  const [abonnement, setAbonnement] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.access_token) return;

      try {
        const headers = { 'Authorization': `Bearer ${session.access_token}` };

        const [abonnementRes, favorisRes] = await Promise.all([
          fetch(`${API_URL}/api/abonnements/check`, { headers }),
          fetch(`${API_URL}/api/favoris`, { headers })
        ]);

        if (!abonnementRes.ok) throw new Error(`Erreur abonnement : ${abonnementRes.status}`);
        if (!favorisRes.ok) throw new Error(`Erreur favoris : ${favorisRes.status}`);

        const [abonnementData, favorisData] = await Promise.all([
          abonnementRes.json(),
          favorisRes.json()
        ]);

        setAbonnement(abonnementData);
        setFavoris(favorisData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const joursRestants = () => {
    if (!abonnement?.date_fin) return 0;
    const diff = new Date(abonnement.date_fin) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wiky-gray-light">
        <div className="text-wiky-blue font-semibold">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wiky-gray-light">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur : {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-wiky-blue mb-8">Mon Dashboard Recruteur</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-wiky-blue">{favoris.length}</div>
            <div className="text-sm text-wiky-gray">Favoris</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-3xl font-bold text-wiky-blue">
              {abonnement?.active ? `${joursRestants()}j` : '—'}
            </div>
            <div className="text-sm text-wiky-gray">Jours restants</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">{abonnement?.active ? '✅' : '❌'}</div>
            <div className="text-3xl font-bold text-wiky-blue">
              {abonnement?.active ? 'Actif' : 'Inactif'}
            </div>
            <div className="text-sm text-wiky-gray">Abonnement</div>
          </div>
        </div>

        {/* Abonnement */}
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-bold text-wiky-blue mb-4">Mon Abonnement</h2>
          {abonnement?.active ? (
            <p className="text-wiky-gray mb-4">
              Actif jusqu'au <span className="font-semibold">{formatDate(abonnement.date_fin)}</span>
            </p>
          ) : (
            <p className="text-red-600 mb-4">Aucun abonnement actif. Abonnez-vous pour accéder aux coordonnées des conducteurs.</p>
          )}
          <Link to="/paiement" className="btn btn-secondary">
            {abonnement?.active ? "Renouveler l'Abonnement" : "S'abonner — 10.000 FCFA/mois"}
          </Link>
        </div>

        {/* Favoris */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-wiky-blue mb-6">
            Mes Favoris ({favoris.length})
          </h2>
          {favoris.length === 0 ? (
            <p className="text-wiky-gray">
              Vous n'avez pas encore de favoris.{' '}
              <Link to="/repertoire" className="text-wiky-blue hover:text-wiky-orange font-semibold">
                Parcourir le répertoire
              </Link>
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {favoris.map((favori) => {
                const c = favori.conducteurs;
                return (
                  <Link
                    key={favori.id}
                    to={`/conducteur/${c?.id}`}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-wiky-gray-light transition-colors"
                  >
                    <img
                      src={c?.photo_url || `https://ui-avatars.com/api/?name=${c?.prenom}+${c?.nom}&size=80&background=253b56&color=fff`}
                      alt={`${c?.prenom} ${c?.nom}`}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-wiky-blue">{c?.prenom} {c?.nom}</p>
                      <p className="text-sm text-wiky-gray">{c?.commune} — {c?.annees_experience}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardRecruteur;
