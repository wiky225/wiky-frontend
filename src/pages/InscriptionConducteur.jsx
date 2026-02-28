import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PhoneInput from '../components/PhoneInput';

import API_URL from '../lib/api.js';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', sexe: '', date_naissance: '', email: '', telephone: '',
    password: '', password_confirm: '',
    nationalite: '', nationalite_autre: '', type_piece: '', numero_piece: '',
    ville: '', commune: '', quartier: '', annees_experience: '',
    plateformes_vtc: '', situation_matrimoniale: '', nombre_enfants: 0,
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      // 1. Créer le compte Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { role: 'conducteur' },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (authError) throw authError;

      const token = authData.session?.access_token;

      // 2. Créer le profil conducteur
      const { nom, prenom, sexe, date_naissance, email, telephone,
        nationalite, nationalite_autre, type_piece, numero_piece,
        ville, commune, quartier, annees_experience,
        plateformes_vtc, situation_matrimoniale, nombre_enfants, description } = formData;

      const nationaliteFinale = nationalite === 'Autre' ? nationalite_autre.trim() : nationalite;

      const response = await fetch(`${API_URL}/api/conducteurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          nom, prenom, sexe, date_naissance, email, telephone,
          nationalite: nationaliteFinale, type_piece, numero_piece,
          ville, commune, quartier, annees_experience,
          plateformes_vtc, situation_matrimoniale,
          nombre_enfants: parseInt(nombre_enfants) || 0,
          description
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du profil.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-wikya-gray-light flex items-center justify-center py-12">
        <div className="card p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-wikya-blue mb-3">Compte créé avec succès !</h2>
          <p className="text-wikya-gray mb-2">
            Un email de confirmation a été envoyé à <strong>{formData.email}</strong>.
          </p>
          <p className="text-wikya-gray mb-6">
            Cliquez sur le lien dans l'email pour activer votre compte, puis connectez-vous.
          </p>
          <Link to="/connexion" className="btn btn-primary w-full">
            Aller à la Connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold text-wikya-blue mb-8">Inscription Conducteur VTC</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom *</label>
              <input type="text" name="nom" required onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prénom *</label>
              <input type="text" name="prenom" required onChange={handleChange} className="input" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sexe *</label>
              <select name="sexe" required onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de naissance *</label>
              <input type="date" name="date_naissance" required onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Identité */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nationalité *</label>
              <select name="nationalite" required onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                <option value="Ivoirien(ne)">Ivoirien(ne)</option>
                <option value="Burkinabè">Burkinabè</option>
                <option value="Malien(ne)">Malien(ne)</option>
                <option value="Guinéen(ne)">Guinéen(ne)</option>
                <option value="Sénégalais(e)">Sénégalais(e)</option>
                <option value="Nigérien(ne)">Nigérien(ne)</option>
                <option value="Béninois(e)">Béninois(e)</option>
                <option value="Togolais(e)">Togolais(e)</option>
                <option value="Ghanéen(ne)">Ghanéen(ne)</option>
                <option value="Nigérian(e)">Nigérian(e)</option>
                <option value="Camerounais(e)">Camerounais(e)</option>
                <option value="Autre">Autre</option>
              </select>
              {formData.nationalite === 'Autre' && (
                <input
                  type="text"
                  name="nationalite_autre"
                  required
                  onChange={handleChange}
                  placeholder="Précisez votre nationalité"
                  className="input mt-2"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type de pièce *</label>
              <select name="type_piece" required onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                <option value="CNI">CNI</option>
                <option value="Passeport">Passeport</option>
                <option value="Titre de séjour">Titre de séjour</option>
                <option value="Carte consulaire">Carte consulaire</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Numéro de pièce *</label>
              <input type="text" name="numero_piece" required onChange={handleChange} placeholder="Ex: CI0123456789" className="input" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input type="email" name="email" required onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone *</label>
              <PhoneInput name="telephone" value={formData.telephone} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe *</label>
              <input type="password" name="password" required onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirmer le mot de passe *</label>
              <input type="password" name="password_confirm" required onChange={handleChange} className="input" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ville *</label>
              <select name="ville" required onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                {VILLES_CI.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Commune (si Abidjan)</label>
              <select name="commune" onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                {COMMUNES_ABIDJAN.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quartier</label>
            <input type="text" name="quartier" onChange={handleChange} className="input" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Situation matrimoniale *</label>
              <select name="situation_matrimoniale" required onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nombre d'enfants *</label>
              <select name="nombre_enfants" required onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                {[...Array(13)].map((_, i) => (
                  <option key={i} value={i}>{i === 0 ? 'Aucun' : i}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Années d'expérience *</label>
            <select name="annees_experience" required onChange={handleChange} className="input">
              <option value="">Sélectionnez...</option>
              <option value="Moins d'1 an">Moins d'1 an</option>
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={`${i + 1} an${i + 1 > 1 ? 's' : ''}`}>{i + 1} an{i + 1 > 1 ? 's' : ''}</option>
              ))}
              <option value="Plus de 15 ans">Plus de 15 ans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dernière plateforme utilisée *</label>
            <select name="plateformes_vtc" required onChange={handleChange} className="input">
              <option value="">Sélectionnez...</option>
              <option value="Yango">Yango</option>
              <option value="Uber">Uber</option>
              <option value="Heetch">Heetch</option>
              <option value="Africab">Africab</option>
              <option value="Taxijet">Taxijet</option>
              <option value="Aucune">Aucune (nouveau conducteur)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optionnel)</label>
            <textarea name="description" rows="4" onChange={handleChange} className="input" placeholder="Parlez de vous, vos compétences..."></textarea>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="checkbox" id="terms" required className="mt-0.5 shrink-0 w-4 h-4 accent-wikya-blue" />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                J'ai lu et j'accepte les{' '}
                <Link to="/conditions-generales" target="_blank" className="text-wikya-blue hover:underline font-semibold">
                  Conditions Générales d'Utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/politique-confidentialite" target="_blank" className="text-wikya-blue hover:underline font-semibold">
                  Politique de confidentialité
                </Link>{' '}
                de Wikya.
              </label>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="checkbox" id="autorisation_donnees" required className="mt-0.5 shrink-0 w-4 h-4 accent-wikya-blue" />
              <label htmlFor="autorisation_donnees" className="text-sm text-gray-600 leading-relaxed">
                J'autorise Wikya (ABDEONA TRANSPORT LOGISTIQUE) à collecter et traiter mes données personnelles,
                y compris mes documents d'identité et mon permis de conduire, à des fins de mise en relation
                professionnelle avec des recruteurs VTC abonnés à la plateforme.
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
