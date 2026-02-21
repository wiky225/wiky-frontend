import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isRecruteur = user?.user_metadata?.role === 'recruteur';
  const dashboardPath = user?.user_metadata?.role === 'conducteur'
    ? '/dashboard-conducteur'
    : user?.user_metadata?.role === 'admin'
    ? '/dashboard-admin'
    : '/dashboard-recruteur';

  const close = () => setMenuOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center">
            <img src="/assets/wiky-logo.png" alt="Wikya by ATL Cars" className="h-12" />
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-wikya-gray hover:text-wikya-orange transition-colors text-sm">
              Accueil
            </Link>
            <Link to="/repertoire" className="text-wikya-gray hover:text-wikya-orange transition-colors text-sm">
              Conducteurs
            </Link>
            <Link to="/offres" className="text-wikya-gray hover:text-wikya-orange transition-colors text-sm">
              {isRecruteur ? 'Mes Offres' : 'Offres Recruteurs'}
            </Link>
            {user ? (
              <>
                <Link to={dashboardPath} className="text-wikya-gray hover:text-wikya-orange transition-colors text-sm">
                  Mon Espace
                </Link>
                <button onClick={handleLogout} className="btn btn-outline text-sm py-2">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="btn btn-outline text-sm py-2">
                  Connexion
                </Link>
                <Link to="/inscription" className="btn btn-primary text-sm py-2">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Bouton hamburger mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-wikya-blue rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-wikya-blue rounded transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 bg-wikya-blue rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div className="md:hidden border-t mt-3 pt-4 pb-2 flex flex-col gap-1">
            <Link to="/" onClick={close} className="px-3 py-2.5 rounded-lg text-wikya-gray hover:bg-gray-50 hover:text-wikya-orange transition-colors">
              Accueil
            </Link>
            <Link to="/repertoire" onClick={close} className="px-3 py-2.5 rounded-lg text-wikya-gray hover:bg-gray-50 hover:text-wikya-orange transition-colors">
              Conducteurs
            </Link>
            <Link to="/offres" onClick={close} className="px-3 py-2.5 rounded-lg text-wikya-gray hover:bg-gray-50 hover:text-wikya-orange transition-colors">
              {isRecruteur ? 'Mes Offres' : 'Offres Recruteurs'}
            </Link>
            {user ? (
              <>
                <Link to={dashboardPath} onClick={close} className="px-3 py-2.5 rounded-lg text-wikya-gray hover:bg-gray-50 hover:text-wikya-orange transition-colors">
                  Mon Espace
                </Link>
                <div className="pt-2 mt-1 border-t">
                  <button onClick={handleLogout} className="btn btn-outline w-full">
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 mt-1 border-t">
                <Link to="/connexion" onClick={close} className="btn btn-outline w-full text-center">
                  Connexion
                </Link>
                <Link to="/inscription" onClick={close} className="btn btn-primary w-full text-center">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
