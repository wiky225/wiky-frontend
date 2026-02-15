import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo Wiky by ATL Cars uniquement */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/wiky-logo.png" 
              alt="Wiky by ATL Cars" 
              className="h-14"
            />
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-wiky-gray hover:text-wiky-orange transition-colors"
            >
              Accueil
            </Link>
            <Link 
              to="/repertoire" 
              className="text-wiky-gray hover:text-wiky-orange transition-colors"
            >
              Trouver un Conducteur
            </Link>
            <Link 
              to="/connexion" 
              className="text-wiky-gray hover:text-wiky-orange transition-colors"
            >
              Connexion
            </Link>
            <Link 
              to="/inscription-conducteur" 
              className="btn btn-primary"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}