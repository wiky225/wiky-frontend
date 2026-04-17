import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserMenu({ user, dashboardPath, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const initiales = (user?.user_metadata?.prenom?.[0] || user?.email?.[0] || '?').toUpperCase();
  const displayName = user?.user_metadata?.prenom
    ? `${user.user_metadata.prenom} ${user.user_metadata.nom || ''}`.trim()
    : user?.email?.split('@')[0] || 'Mon compte';
  const role = user?.user_metadata?.role;
  const roleLabel = role === 'conducteur' ? 'Conducteur' : role === 'recruteur' ? 'Recruteur' : 'Admin';

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-100 transition-colors"
        aria-label="Menu compte"
      >
        <div className="w-8 h-8 rounded-full bg-wikya-blue text-white flex items-center justify-center text-sm font-bold shrink-0">
          {initiales}
        </div>
        <span className="text-sm font-medium text-wikya-gray hidden lg:block max-w-[120px] truncate">
          {displayName}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          {/* Infos utilisateur */}
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-blue-50 text-wikya-blue px-2 py-0.5 rounded-full font-medium">
              {roleLabel}
            </span>
          </div>

          {/* Liens */}
          <div className="py-1">
            <Link
              to={dashboardPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wikya-blue transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Mon tableau de bord
            </Link>
            <Link
              to={dashboardPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wikya-blue transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
          </div>

          {/* Déconnexion */}
          <div className="border-t border-gray-50 py-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="container-custom py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center">
            <img src="/assets/wikya-logo-new.png" alt="Wikya by ATL Cars" className="h-12" />
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-wikya-blue hover:bg-gray-50 transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/repertoire" className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-wikya-blue hover:bg-gray-50 transition-colors font-medium">
              Conducteurs
            </Link>
            <Link to="/offres" className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-wikya-blue hover:bg-gray-50 transition-colors font-medium">
              {isRecruteur ? 'Mes Offres' : 'Offres'}
            </Link>

            <div className="w-px h-5 bg-gray-200 mx-2" />

            {user ? (
              <UserMenu user={user} dashboardPath={dashboardPath} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/connexion" className="btn btn-outline text-sm py-2 px-4">
                  Connexion
                </Link>
                <Link to="/inscription" className="btn btn-primary text-sm py-2 px-4">
                  S'inscrire
                </Link>
              </div>
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
            <Link to="/" onClick={close} className="px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-wikya-blue transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/repertoire" onClick={close} className="px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-wikya-blue transition-colors font-medium">
              Conducteurs
            </Link>
            <Link to="/offres" onClick={close} className="px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-wikya-blue transition-colors font-medium">
              {isRecruteur ? 'Mes Offres' : 'Offres'}
            </Link>
            {user ? (
              <>
                <Link to={dashboardPath} onClick={close} className="px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-wikya-blue transition-colors font-medium">
                  Mon tableau de bord
                </Link>
                <div className="pt-2 mt-1 border-t">
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Se déconnecter
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
