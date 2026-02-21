import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [sessionPrete, setSessionPrete] = useState(false);

  useEffect(() => {
    // Supabase échange automatiquement le token du lien (hash ou code PKCE)
    // et émet un événement PASSWORD_RECOVERY quand la session est prête.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionPrete(true);
      }
    });

    // Flux PKCE : ?code=... dans l'URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) setSessionPrete(true);
        else setErreur('Lien invalide ou expiré. Recommencez la procédure.');
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    if (password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      navigate('/connexion?mdp_modifie=1', { replace: true });
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // Lien invalide ou expiré
  if (erreur && !sessionPrete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-wiky-blue mb-2">Lien invalide</h1>
          <p className="text-gray-500 mb-6">{erreur}</p>
          <a href="/mot-de-passe-oublie" className="btn btn-primary">
            Recommencer
          </a>
        </div>
      </div>
    );
  }

  // Attente de la session (token en cours d'échange)
  if (!sessionPrete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-wiky-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Vérification du lien…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-wiky-blue mb-1">Nouveau mot de passe</h1>
        <p className="text-gray-400 text-sm mb-6">
          Choisissez un mot de passe d'au moins 6 caractères.
        </p>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-wiky-gray mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-wiky-gray mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 disabled:opacity-60"
          >
            {loading ? 'Mise à jour...' : 'Enregistrer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}
