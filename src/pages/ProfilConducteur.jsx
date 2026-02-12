import { useParams, Link } from 'react-router-dom'

function ProfilConducteur() {
  const { id } = useParams()
  
  // Données mockées
  const conducteur = {
    id: id,
    nom: 'Kouadio Jean',
    age: 32,
    dateNaissance: '15/03/1992',
    telephone: '+225 07 12 34 56 78',
    email: 'kouadio.jean@email.com',
    commune: 'Cocody',
    quartier: 'Angré',
    experience: '5 ans',
    typeVTC: 'Uber, Yango',
    photo: '👨',
    statut: 'Disponible',
    description: 'Conducteur expérimenté, ponctuel et professionnel. Véhicule climatisé et bien entretenu.'
  }

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom max-w-4xl">
        {/* Retour */}
        <Link to="/repertoire" className="inline-flex items-center text-wiky-blue hover:text-wiky-orange mb-6">
          ← Retour au répertoire
        </Link>

        {/* Carte profil */}
        <div className="card p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-wiky-gray-light rounded-xl flex items-center justify-center text-8xl">
                {conducteur.photo}
              </div>
              <div className="mt-4">
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg w-full text-center">
                  {conducteur.statut}
                </span>
              </div>
            </div>

            {/* Informations */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-wiky-blue mb-2">{conducteur.nom}</h1>
              <p className="text-wiky-gray mb-6">{conducteur.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-semibold text-wiky-gray">Âge:</span>
                  <p className="text-lg">{conducteur.age} ans</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-wiky-gray">Expérience:</span>
                  <p className="text-lg">{conducteur.experience}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-wiky-gray">Localisation:</span>
                  <p className="text-lg">{conducteur.quartier}, {conducteur.commune}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-wiky-gray">Plateformes VTC:</span>
                  <p className="text-lg">{conducteur.typeVTC}</p>
                </div>
              </div>

              <div className="bg-wiky-gray-light p-4 rounded-lg mb-6">
                <h3 className="font-bold text-wiky-blue mb-2">Informations de contact</h3>
                <p className="text-sm text-wiky-gray mb-2">📞 {conducteur.telephone}</p>
                <p className="text-sm text-wiky-gray">📧 {conducteur.email}</p>
              </div>

              <div className="flex gap-4">
                <button className="btn btn-primary flex-1">
                  Contacter le Conducteur
                </button>
                <button className="btn btn-outline">
                  ⭐ Ajouter aux Favoris
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Abonnement si non connecté */}
        <div className="mt-8 bg-wiky-orange text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Accédez aux informations complètes</h3>
          <p className="mb-4">Abonnez-vous pour voir tous les détails et contacter les conducteurs</p>
          <Link to="/inscription-recruteur" className="btn bg-white text-wiky-orange hover:bg-gray-100">
            S'abonner Maintenant - 15.000 FCFA/mois
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProfilConducteur
