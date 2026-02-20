import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Page intermédiaire appelée quand l'utilisateur clique sur le lien
 * de confirmation d'email envoyé par Supabase.
 *
 * Supabase redirige vers :
 *   /auth/confirm#access_token=...&type=signup   (flux implicite)
 * ou
 *   /auth/confirm?code=...                        (flux PKCE)
 *
 * On échange le token / code, puis on redirige vers /connexion
 * avec un message de succès.
 */
export default function AuthConfirm() {
  const navigate = useNavigate();
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const handleConfirm = async () => {
      // ── Flux PKCE : ?code=... ──────────────────────────────────
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setErreur("Le lien de confirmation est invalide ou a expiré.");
          return;
        }
        // Déconnexion immédiate : on veut juste valider l'email,
        // pas connecter l'utilisateur automatiquement.
        await supabase.auth.signOut();
        navigate('/connexion?email_confirme=1', { replace: true });
        return;
      }

      // ── Flux implicite : #access_token=... ────────────────────
      // onAuthStateChange dans AuthContext intercepte déjà le hash
      // et crée la session. On attend un tick puis on redirige.
      const hash = window.location.hash;
      if (hash.includes('access_token') && hash.includes('type=signup')) {
        // Laisser Supabase traiter le hash, puis déconnecter
        setTimeout(async () => {
          await supabase.auth.signOut();
          navigate('/connexion?email_confirme=1', { replace: true });
        }, 800);
        return;
      }

      // Aucun token trouvé → redirection simple
      navigate('/connexion', { replace: true });
    };

    handleConfirm();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {erreur ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-wiky-blue mb-2">Lien invalide</h1>
          <p className="text-gray-500 mb-6">{erreur}</p>
          <a href="/connexion" className="btn btn-primary">Aller à la connexion</a>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-wiky-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Vérification en cours…
        </div>
      )}
    </div>
  );
}
