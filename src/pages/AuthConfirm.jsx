import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import API_URL from '../lib/api.js';

async function getRedirectPath(session) {
  const role = session?.user?.user_metadata?.role;
  if (role !== 'conducteur') return '/connexion?email_confirme=1';

  try {
    const res = await fetch(`${API_URL}/api/conducteurs/moi`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return '/connexion?email_confirme=1';
    const profil = await res.json();
    return profil.inscription_finalisee ? '/dashboard-conducteur' : '/completer-profil';
  } catch {
    return '/connexion?email_confirme=1';
  }
}

export default function AuthConfirm() {
  const navigate = useNavigate();
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const handleConfirm = async () => {
      // ── Flux PKCE : ?code=... ──────────────────────────────────
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setErreur('Le lien de confirmation est invalide ou a expiré.');
          return;
        }
        const path = await getRedirectPath(data.session);
        // Si on redirige vers completer-profil, on garde la session active
        if (path !== '/completer-profil') {
          await supabase.auth.signOut();
          navigate('/connexion?email_confirme=1', { replace: true });
        } else {
          navigate(path, { replace: true });
        }
        return;
      }

      // ── Flux implicite : #access_token=... ────────────────────
      const hash = window.location.hash;
      if (hash.includes('access_token') && hash.includes('type=signup')) {
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            navigate('/connexion?email_confirme=1', { replace: true });
            return;
          }
          const path = await getRedirectPath(session);
          if (path !== '/completer-profil') {
            await supabase.auth.signOut();
            navigate('/connexion?email_confirme=1', { replace: true });
          } else {
            navigate(path, { replace: true });
          }
        }, 800);
        return;
      }

      navigate('/connexion', { replace: true });
    };

    handleConfirm();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {erreur ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-wikya-blue mb-2">Lien invalide</h1>
          <p className="text-gray-500 mb-6">{erreur}</p>
          <a href="/connexion" className="btn btn-primary">Aller à la connexion</a>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-wikya-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Vérification en cours…
        </div>
      )}
    </div>
  );
}
