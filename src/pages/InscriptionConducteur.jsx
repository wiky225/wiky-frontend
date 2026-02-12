import { useState } from 'react'

function InscriptionConducteur() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    telephone: '',
    email: '',
    commune: '',
    quartier: '',
    experience: '',
    typeVTC: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Fonctionnalité disponible après connexion backend!')
  }

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom max-w-3xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wiky-blue mb-2">Inscription Conducteur</h1>
          <p className="text-wiky-gray mb-8">Créez votre profil et rejoignez la plateforme Wiky</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Nom *</label>
                <input 
                  type="text" 
                  className="input" 
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Prénom *</label>
                <input 
                  type="text" 
                  className="input" 
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Date de naissance *</label>
                <input 
                  type="date" 
                  className="input" 
                  required
                  value={formData.dateNaissance}
                  onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Téléphone *</label>
                <input 
                  type="tel" 
                  className="input" 
                  placeholder="+225 XX XX XX XX XX"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Email *</label>
              <input 
                type="email" 
                className="input" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Commune *</label>
                <select 
                  className="input"
                  required
                  value={formData.commune}
                  onChange={(e) => setFormData({...formData, commune: e.target.value})}
                >
                  <option value="">Sélectionnez...</option>
                  <option>Cocody</option>
                  <option>Plateau</option>
                  <option>Marcory</option>
                  <option>Yopougon</option>
                  <option>Abobo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Quartier *</label>
                <input 
                  type="text" 
                  className="input" 
                  required
                  value={formData.quartier}
                  onChange={(e) => setFormData({...formData, quartier: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Années d'expérience *</label>
                <select 
                  className="input"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                >
                  <option value="">Sélectionnez...</option>
                  <option>Moins d'1 an</option>
                  <option>1-2 ans</option>
                  <option>3-5 ans</option>
                  <option>Plus de 5 ans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Plateformes VTC *</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Ex: Uber, Yango, Bolt"
                  required
                  value={formData.typeVTC}
                  onChange={(e) => setFormData({...formData, typeVTC: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-wiky-gray-light p-4 rounded-lg">
              <p className="text-sm text-wiky-gray">
                * Champs obligatoires. Vos informations seront vérifiées avant publication du profil.
              </p>
            </div>

            <button type="submit" className="btn btn-primary w-full text-lg py-4">
              Créer Mon Profil
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InscriptionConducteur
