import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="py-12 bg-wiky-gray-light min-h-screen flex items-center">
      <div className="container-custom max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wiky-blue mb-2 text-center">Connexion</h1>
          <p className="text-wiky-gray mb-8 text-center">Accédez à votre compte Wiky</p>

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
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Email</label>
              <input
                type="email"
                className="input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Mot de passe</label>
              <input
                type="password"
                className="input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm text-wiky-gray">Se souvenir de moi</span>
              </label>
              <Link to="/mot-de-passe-oublie" className="text-sm text-wiky-blue hover:text-wiky-orange">Mot de passe oublié ?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>

            <div className="text-center text-sm text-wiky-gray">
              Pas encore de compte ?
              <div className="mt-2 space-y-2">
                <Link to="/inscription-conducteur" className="block text-wiky-blue hover:text-wiky-orange font-semibold">
                  S'inscrire comme Conducteur
                </Link>
                <Link to="/inscription-recruteur" className="block text-wiky-blue hover:text-wiky-orange font-semibold">
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
