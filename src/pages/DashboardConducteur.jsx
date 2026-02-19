import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function DashboardConducteur() {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        // 1. Cherche par user_id
        let { data, error } = await supabase
          .from('conducteurs')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        // 2. Si pas trouvé, cherche par email et lie le profil
        if (!data && user.email) {
          const { data: byEmail, error: emailError } = await supabase
            .from('conducteurs')
            .select('*')
            .eq('email', user.email)
            .is('user_id', null)
            .maybeSingle();

          if (emailError) throw emailError;

          if (byEmail) {
            await supabase
              .from('conducteurs')
              .update({ user_id: user.id })
              .eq('id', byEmail.id);
            data = { ...byEmail, user_id: user.id };
          }
        }

        setProfil(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfil();
  }, [user]);

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

  if (!profil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wiky-gray-light">
        <div className="card p-8 max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-wiky-blue mb-3">Profil non trouvé</h2>
          <p className="text-wiky-gray mb-6">
            Votre profil conducteur n'a pas encore été créé. Cela peut arriver si vous venez de confirmer votre email.
          </p>
          <Link to="/inscription-conducteur" className="btn btn-primary w-full">
            Compléter mon inscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-wiky-blue mb-8">
          Bonjour, {profil?.prenom} {profil?.nom}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-4xl mb-2">👁️</div>
            <div className="text-3xl font-bold text-wiky-blue">{profil?.nb_vues ?? 0}</div>
            <div className="text-sm text-wiky-gray">Vues du profil</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-wiky-blue">{profil?.nb_favoris ?? 0}</div>
            <div className="text-sm text-wiky-gray">Mis en favoris</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-wiky-blue capitalize">{profil?.statut ?? 'disponible'}</div>
            <div className="text-sm text-wiky-gray">Statut</div>
          </div>
        </div>

        {/* Profil */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-wiky-blue mb-6">Mon Profil</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-sm font-semibold text-wiky-gray block mb-1">Localisation</span>
              <p>{[profil?.quartier, profil?.commune].filter(Boolean).join(', ') || '—'}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-wiky-gray block mb-1">Expérience</span>
              <p>{profil?.annees_experience || '—'}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-wiky-gray block mb-1">Plateformes VTC</span>
              <p>{profil?.plateformes_vtc || '—'}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-wiky-gray block mb-1">Téléphone</span>
              <p>{profil?.telephone || '—'}</p>
            </div>
          </div>
          {profil?.id && (
            <Link to={`/conducteur/${profil.id}`} className="btn btn-primary">
              Voir Mon Profil Public
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardConducteur;
