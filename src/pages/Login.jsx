import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailConfirme = searchParams.get('email_confirme') === '1';
  const mdpModifie = searchParams.get('mdp_modifie') === '1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await login(email, password);
      const role = user?.user_metadata?.role;
      const destination = role === 'conducteur'
        ? '/dashboard-conducteur'
        : role === 'admin'
        ? '/dashboard-admin'
        : '/dashboard-recruteur';
      navigate(destination);
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-wikya-gray-light min-h-screen flex items-center">
      <div className="container-custom max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wikya-blue mb-2 text-center">Connexion</h1>
          <p className="text-wikya-gray mb-8 text-center">Accédez à votre compte Wikya</p>

          {emailConfirme && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              ✅ Votre email a bien été confirmé. Vous pouvez maintenant vous connecter.
            </div>
          )}

          {mdpModifie && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              ✅ Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-wikya-gray mb-2">Email</label>
              <input
                type="email"
                className="input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wikya-gray mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Voir le mot de passe'}>
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm text-wikya-gray">Se souvenir de moi</span>
              </label>
              <Link to="/mot-de-passe-oublie" className="text-sm text-wikya-blue hover:text-wikya-orange">Mot de passe oublié ?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>

            <div className="text-center text-sm text-wikya-gray">
              Pas encore de compte ?
              <div className="mt-2 space-y-2">
                <Link to="/inscription-conducteur" className="block text-wikya-blue hover:text-wikya-orange font-semibold">
                  S'inscrire comme Conducteur
                </Link>
                <Link to="/inscription-recruteur" className="block text-wikya-blue hover:text-wikya-orange font-semibold">
                  S'inscrire comme Recruteur
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
