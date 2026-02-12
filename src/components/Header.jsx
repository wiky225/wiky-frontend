import { Link } from 'react-router-dom'
import { useState } from 'react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // TODO: Gérer avec Supabase Auth

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-wiky rounded-lg flex items-center justify-center text-2xl">
              🚗
            </div>
            <div>
              <div className="text-xl font-bold text-wiky-blue">Wiky</div>
              <div className="text-xs text-gray-500">by ATL Cars</div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-wiky-gray hover:text-wiky-orange font-medium transition">
              Accueil
            </Link>
            <Link to="/repertoire" className="text-wiky-gray hover:text-wiky-orange font-medium transition">
              Trouver un Conducteur
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard-conducteur" className="text-wiky-gray hover:text-wiky-orange font-medium transition">
                  Mon Compte
                </Link>
                <button 
                  onClick={() => setIsAuthenticated(false)}
                  className="text-wiky-gray hover:text-wiky-orange font-medium transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="text-wiky-gray hover:text-wiky-orange font-medium transition">
                  Connexion
                </Link>
                <Link to="/inscription-conducteur" className="btn btn-primary">
                  S'inscrire
                </Link>
              </>
            )}
          </nav>

          {/* Menu Mobile Button */}
          <button 
            className="md:hidden p-2 text-wiky-blue"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-3 border-t pt-4">
            <Link 
              to="/" 
              className="block text-wiky-gray hover:text-wiky-orange font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/repertoire" 
              className="block text-wiky-gray hover:text-wiky-orange font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trouver un Conducteur
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard-conducteur" 
                  className="block text-wiky-gray hover:text-wiky-orange font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon Compte
                </Link>
                <button 
                  onClick={() => {
                    setIsAuthenticated(false)
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-wiky-gray hover:text-wiky-orange font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/connexion" 
                  className="block text-wiky-gray hover:text-wiky-orange font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  to="/inscription-conducteur" 
                  className="block btn btn-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
