import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-wiky-blue text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* À propos */}
          <div>
            <h3 className="text-lg font-bold text-wiky-orange mb-4">Wiky by ATL Cars</h3>
            <p className="text-sm opacity-90">
              La plateforme de référence pour la mise en relation VTC en Côte d'Ivoire.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-bold text-wiky-orange mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="opacity-80 hover:opacity-100 hover:text-wiky-orange transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/repertoire" className="opacity-80 hover:opacity-100 hover:text-wiky-orange transition">
                  Répertoire Conducteurs
                </Link>
              </li>
              <li>
                <Link to="/inscription-conducteur" className="opacity-80 hover:opacity-100 hover:text-wiky-orange transition">
                  S'inscrire
                </Link>
              </li>
              <li>
                <Link to="/connexion" className="opacity-80 hover:opacity-100 hover:text-wiky-orange transition">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Pour les Conducteurs */}
          <div>
            <h3 className="text-lg font-bold text-wiky-orange mb-4">Pour les Conducteurs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/inscription-conducteur" className="opacity-80 hover:opacity-100 hover:text-wiky-orange transition">
                  Créer mon profil
                </Link>
              </li>
              <li>
                <a href="#avantages" className="opacity-80 hover:opacity-100 hover:text-wiky-orange transition">
                  Avantages
                </a>
              </li>
              <li>
                <a href="#faq" className="opacity-80 hover:opacity-100 hover:text-wiky-orange transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-wiky-orange mb-4">Contact</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>📧 contact@wiky.ci</li>
              <li>📱 WhatsApp 24/7</li>
              <li>📍 Abidjan, Côte d'Ivoire</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-sm opacity-70">
          <p>&copy; 2026 Wiky by ATL Cars. Tous droits réservés.</p>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/2250700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-transform z-50 animate-pulse"
        title="Contactez-nous sur WhatsApp"
      >
        💬
      </a>
    </footer>
  )
}

export default Footer
