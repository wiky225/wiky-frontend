import { useState } from 'react'
import { Link } from 'react-router-dom'

function Repertoire() {
  // Données mockées pour la démo
  const [conducteurs] = useState([
    {
      id: 1,
      nom: 'Kouadio Jean',
      age: 32,
      experience: '5 ans',
      localisation: 'Cocody',
      photo: '👨',
      statut: 'Disponible'
    },
    {
      id: 2,
      nom: 'Amani Michel',
      age: 28,
      experience: '3 ans',
      localisation: 'Marcory',
      photo: '👨',
      statut: 'Disponible'
    },
    {
      id: 3,
      nom: 'Yao Fabrice',
      age: 35,
      experience: '7 ans',
      localisation: 'Plateau',
      photo: '👨',
      statut: 'Disponible'
    },
    {
      id: 4,
      nom: 'Koné Ibrahim',
      age: 30,
      experience: '4 ans',
      localisation: 'Yopougon',
      photo: '👨',
      statut: 'Disponible'
    }
  ])

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-wiky-blue mb-4">Répertoire des Conducteurs</h1>
          <p className="text-wiky-gray mb-6">Trouvez le conducteur VTC idéal parmi {conducteurs.length} profils vérifiés</p>
          
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Rechercher par nom..." 
              className="input"
            />
            <select className="input">
              <option>Toutes les localisations</option>
              <option>Cocody</option>
              <option>Marcory</option>
              <option>Plateau</option>
              <option>Yopougon</option>
            </select>
            <select className="input">
              <option>Toutes les expériences</option>
              <option>1-3 ans</option>
              <option>3-5 ans</option>
              <option>5+ ans</option>
            </select>
          </div>
        </div>

        {/* Grille des conducteurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {conducteurs.map(conducteur => (
            <Link 
              key={conducteur.id}
              to={`/profil/${conducteur.id}`}
              className="card p-6 hover:-translate-y-2 transition-all"
            >
              <div className="text-6xl mb-4 text-center">{conducteur.photo}</div>
              <h3 className="text-xl font-bold text-wiky-blue mb-2 text-center">{conducteur.nom}</h3>
              <div className="space-y-2 text-sm text-wiky-gray">
                <div className="flex justify-between">
                  <span className="font-semibold">Âge:</span>
                  <span>{conducteur.age} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Expérience:</span>
                  <span>{conducteur.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Zone:</span>
                  <span>{conducteur.localisation}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {conducteur.statut}
                </span>
              </div>
              <button className="btn btn-primary w-full mt-4">
                Voir le profil
              </button>
            </Link>
          ))}
        </div>

        {/* Message pour recruteurs */}
        <div className="mt-12 bg-wiky-blue text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Accédez à tous les profils</h2>
          <p className="mb-6">Abonnez-vous pour contacter les conducteurs et voir leurs informations complètes</p>
          <Link to="/inscription-recruteur" className="btn bg-wiky-orange hover:bg-wiky-orange-dark">
            S'abonner - 15.000 FCFA/mois
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Repertoire
