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
        href="https://wa.me/2250575421717"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50"
        title="Contactez-nous sur WhatsApp Business"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-9 h-9">
          <path fill="#fff" d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z"/>
          <path fill="#25D366" d="M24 6c-9.9 0-18 8.1-18 18 0 3.3.9 6.5 2.6 9.3l.4.7-1.7 6.2 6.4-1.7.7.4C16.9 40.6 20.4 42 24 42c9.9 0 18-8.1 18-18S33.9 6 24 6z"/>
          <path fill="#fff" d="M35.2 31.2c-.5 1.3-2.5 2.5-3.5 2.6-.9.1-2.1.1-3.4-.2-1.3-.3-3-.9-5.2-1.9-4.5-2-7.3-6.7-7.6-7-.2-.3-1.9-2.5-1.9-4.8s1.2-3.4 1.6-3.9c.4-.4.9-.6 1.2-.6h.9c.3 0 .6.1.9.8.3.8 1.2 2.9 1.3 3.1.1.2.2.5.1.8-.1.3-.2.5-.4.7-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.5 1.3 2.7 1.8 3.1 2 .4.2.6.1.9-.1.2-.2.9-1 1.2-1.4.2-.4.5-.3.9-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.1.1.8-.4 2.1z"/>
        </svg>
      </a>
    </footer>
  )
}

export default Footer
