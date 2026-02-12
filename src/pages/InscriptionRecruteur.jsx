import { Link } from 'react-router-dom'

function InscriptionRecruteur() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Fonctionnalité disponible après connexion backend!')
  }

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom max-w-3xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wiky-blue mb-2">Inscription Recruteur</h1>
          <p className="text-wiky-gray mb-8">Accédez à notre répertoire de conducteurs VTC professionnels</p>

          {/* Offre */}
          <div className="bg-wiky-blue text-white rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Abonnement Mensuel</h2>
            <div className="text-4xl font-bold mb-2">15.000 FCFA<span className="text-lg font-normal">/mois</span></div>
            <ul className="space-y-2">
              <li>✅ Accès illimité à 500+ profils conducteurs</li>
              <li>✅ Contact direct avec les conducteurs</li>
              <li>✅ Système de favoris</li>
              <li>✅ Support WhatsApp 24/7</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Nom de l'entreprise *</label>
              <input type="text" className="input" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Nom du responsable *</label>
                <input type="text" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Prénom *</label>
                <input type="text" className="input" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Email professionnel *</label>
              <input type="email" className="input" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Téléphone *</label>
              <input type="tel" className="input" placeholder="+225 XX XX XX XX XX" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Taille de la flotte souhaitée</label>
              <select className="input">
                <option>1-5 conducteurs</option>
                <option>6-10 conducteurs</option>
                <option>11-20 conducteurs</option>
                <option>Plus de 20 conducteurs</option>
              </select>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" required className="mt-1" />
              <label htmlFor="terms" className="text-sm text-wiky-gray">
                J'accepte les conditions d'utilisation et la politique de confidentialité de Wiky
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full text-lg py-4">
              Continuer vers le Paiement
            </button>

            <p className="text-center text-sm text-wiky-gray">
              Déjà inscrit ? <Link to="/connexion" className="text-wiky-blue hover:text-wiky-orange font-semibold">Connectez-vous</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InscriptionRecruteur
