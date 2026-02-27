import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setEnvoye(true);
    } catch (err) {
      setErreur(err.message || "Impossible d'envoyer l'email.");
    } finally {
      setLoading(false);
    }
  };

  if (envoye) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-xl font-bold text-wikya-blue mb-2">Email envoyé !</h1>
          <p className="text-gray-500 mb-6">
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
            Vérifiez votre boîte mail (et vos spams).
          </p>
          <Link to="/connexion" className="text-sm text-wikya-blue hover:underline">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-wikya-blue mb-1">Mot de passe oublié</h1>
        <p className="text-gray-400 text-sm mb-6">
          Saisissez votre email. Vous recevrez un lien pour créer un nouveau mot de passe.
        </p>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-wikya-gray mb-2">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 disabled:opacity-60"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/connexion" className="text-wikya-blue hover:underline">
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
