import { useState } from 'react';

const COMMUNES_ABIDJAN = [
  'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi',
  'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
  'Bingerville', 'Songon', 'Anyama'
];

const VILLES_CI = [
  'Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pedro',
  'Korhogo', 'Man', 'Gagnoa', 'Abengourou', 'Divo',
  'Grand-Bassam', 'Agboville', 'Dabou', 'Adzopé'
];

const SITUATIONS = ['Célibataire', 'Fiancé(e)', 'Marié(e)', 'Veuf(ve)'];

export default function InscriptionConducteur() {
  const [formData, setFormData] = useState({
    nom: '', prenom: '', date_naissance: '', email: '', telephone: '',
    ville: '', commune: '', quartier: '', annees_experience: '',
    plateformes_vtc: '', situation_matrimoniale: '', nombre_enfants: 0,
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Inscription simulée - Fonctionnalité complète bientôt !');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold text-wiky-blue mb-8">Inscription Conducteur VTC</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom *</label>
              <input type="text" name="nom" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prénom *</label>
              <input type="text" name="prenom" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date de naissance *</label>
            <input type="date" name="date_naissance" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone *</label>
              <input type="tel" name="telephone" required onChange={handleChange} placeholder="+225 07 XX XX XX XX" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ville *</label>
              <select name="ville" required onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="">Sélectionnez...</option>
                {VILLES_CI.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Commune (si Abidjan) *</label>
              <select name="commune" onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="">Sélectionnez...</option>
                {COMMUNES_ABIDJAN.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quartier</label>
            <input type="text" name="quartier" onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Situation matrimoniale *</label>
              <select name="situation_matrimoniale" required onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="">Sélectionnez...</option>
                {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nombre d'enfants *</label>
              <input type="number" name="nombre_enfants" min="0" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Années d'expérience *</label>
            <input type="text" name="annees_experience" required onChange={handleChange} placeholder="Ex: 3 ans" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Plateformes VTC utilisées *</label>
            <input type="text" name="plateformes_vtc" required onChange={handleChange} placeholder="Ex: Uber, Yango, Bolt" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optionnel)</label>
            <textarea name="description" rows="4" onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Parlez de vous, vos compétences..."></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-full">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}