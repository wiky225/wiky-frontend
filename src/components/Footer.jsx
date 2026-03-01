import { Link } from 'react-router-dom';

const ANNEE = new Date().getFullYear();

const lienClass = "opacity-70 hover:opacity-100 hover:text-wikya-orange transition-all text-sm";

function Footer() {
  return (
    <>
      <footer className="bg-wikya-blue text-white">
        {/* Bandeau orange fin en haut */}
        <div className="h-1 bg-wikya-orange w-full" />

        <div className="container-custom py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

            {/* Bloc marque */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold text-white mb-3">Wikya by ATL Cars</h3>
              <p className="text-sm opacity-70 leading-relaxed mb-5">
                La plateforme de référence pour la mise en relation entre conducteurs VTC et recruteurs en Côte d'Ivoire.
              </p>
              <div className="flex items-center gap-2 text-sm opacity-60">
                <span>📍</span>
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
            </div>

            {/* Conducteurs */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-wikya-orange mb-4">
                Conducteurs
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/inscription-conducteur" className={lienClass}>
                    Créer mon profil
                  </Link>
                </li>
                <li>
                  <Link to="/repertoire" className={lienClass}>
                    Répertoire
                  </Link>
                </li>
                <li>
                  <Link to="/connexion" className={lienClass}>
                    Se connecter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recruteurs */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-wikya-orange mb-4">
                Recruteurs
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/inscription-recruteur" className={lienClass}>
                    Créer mon compte
                  </Link>
                </li>
                <li>
                  <Link to="/offres" className={lienClass}>
                    Offres de recrutement
                  </Link>
                </li>
                <li>
                  <Link to="/connexion" className={lienClass}>
                    Se connecter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-wikya-orange mb-4">
                Légal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/mentions-legales" className={lienClass}>
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/politique-confidentialite" className={lienClass}>
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/conditions-generales" className={lienClass}>
                    CGU
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-wikya-orange mb-4">
                Contact
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://wa.me/2250575421717"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                      <path fill="#fff" d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z"/>
                      <path fill="#25D366" d="M24 6c-9.9 0-18 8.1-18 18 0 3.3.9 6.5 2.6 9.3l.4.7-1.7 6.2 6.4-1.7.7.4C16.9 40.6 20.4 42 24 42c9.9 0 18-8.1 18-18S33.9 6 24 6z"/>
                      <path fill="#fff" d="M35.2 31.2c-.5 1.3-2.5 2.5-3.5 2.6-.9.1-2.1.1-3.4-.2-1.3-.3-3-.9-5.2-1.9-4.5-2-7.3-6.7-7.6-7-.2-.3-1.9-2.5-1.9-4.8s1.2-3.4 1.6-3.9c.4-.4.9-.6 1.2-.6h.9c.3 0 .6.1.9.8.3.8 1.2 2.9 1.3 3.1.1.2.2.5.1.8-.1.3-.2.5-.4.7-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.5 1.3 2.7 1.8 3.1 2 .4.2.6.1.9-.1.2-.2.9-1 1.2-1.4.2-.4.5-.3.9-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.1.1.8-.4 2.1z"/>
                    </svg>
                    WhatsApp 24/7
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@wikya.ci" className={lienClass + " flex items-center gap-2"}>
                    <span>📧</span> contact@wikya.ci
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t border-white/10">
          <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
            <p>&copy; {ANNEE} Wikya by ATL Cars — Tous droits réservés</p>
            <a href="https://www.answerlabs.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span>Réalisé par</span>
              <img src="/assets/answerlabs-logo.png" alt="Answer Labs" className="h-4 inline-block" />
            </a>
          </div>
        </div>
      </footer>

      {/* Bouton WhatsApp flottant */}
      <a
        href="https://wa.me/2250575421717"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50"
        title="Contactez-nous sur WhatsApp"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-8">
          <path fill="#fff" d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z"/>
          <path fill="#25D366" d="M24 6c-9.9 0-18 8.1-18 18 0 3.3.9 6.5 2.6 9.3l.4.7-1.7 6.2 6.4-1.7.7.4C16.9 40.6 20.4 42 24 42c9.9 0 18-8.1 18-18S33.9 6 24 6z"/>
          <path fill="#fff" d="M35.2 31.2c-.5 1.3-2.5 2.5-3.5 2.6-.9.1-2.1.1-3.4-.2-1.3-.3-3-.9-5.2-1.9-4.5-2-7.3-6.7-7.6-7-.2-.3-1.9-2.5-1.9-4.8s1.2-3.4 1.6-3.9c.4-.4.9-.6 1.2-.6h.9c.3 0 .6.1.9.8.3.8 1.2 2.9 1.3 3.1.1.2.2.5.1.8-.1.3-.2.5-.4.7-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.5 1.3 2.7 1.8 3.1 2 .4.2.6.1.9-.1.2-.2.9-1 1.2-1.4.2-.4.5-.3.9-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.1.1.8-.4 2.1z"/>
        </svg>
      </a>
    </>
  );
}

export default Footer;
