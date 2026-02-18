import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = user?.user_metadata?.role === 'conducteur'
    ? '/dashboard-conducteur'
    : '/dashboard-recruteur';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/assets/wiky-logo.png"
              alt="Wiky by ATL Cars"
              className="h-14"
            />
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-wiky-gray hover:text-wiky-orange transition-colors">
              Accueil
            </Link>
            <Link to="/repertoire" className="text-wiky-gray hover:text-wiky-orange transition-colors">
              Trouver un Conducteur
            </Link>

            {user ? (
              <>
                <Link to={dashboardPath} className="text-wiky-gray hover:text-wiky-orange transition-colors">
                  Mon Espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="text-wiky-gray hover:text-wiky-orange transition-colors">
                  Connexion
                </Link>
                <Link to="/inscription-conducteur" className="btn btn-primary">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
