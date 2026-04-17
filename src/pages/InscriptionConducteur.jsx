import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PhoneInput from '../components/PhoneInput';
import { Turnstile } from '@marsidev/react-turnstile';
import API_URL from '../lib/api.js';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

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

const STEPS = [
  { number: 1, label: 'Identité' },
  { number: 2, label: 'Contact & Localisation' },
  { number: 3, label: 'Expérience & Finalisation' },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              current > step.number ? 'bg-wikya-blue text-white' :
              current === step.number ? 'bg-wikya-blue text-white ring-4 ring-blue-100' :
              'bg-gray-100 text-gray-400'
            }`}>
              {current > step.number ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : step.number}
            </div>
            <span className={`text-xs mt-1 font-medium hidden sm:block ${current === step.number ? 'text-wikya-blue' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`w-16 sm:w-24 h-0.5 mx-1 mb-4 transition-colors ${current > step.number ? 'bg-wikya-blue' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function InscriptionConducteur() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', sexe: '', date_naissance: '',
    nationalite: '', nationalite_autre: '', type_piece: '', numero_piece: '',
    email: '', telephone: '', password: '', password_confirm: '',
    ville: '', commune: '', quartier: '',
    annees_experience: '', plateformes_vtc: '',
    situation_matrimoniale: '', nombre_enfants: 0, description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.nom || !formData.prenom || !formData.sexe || !formData.date_naissance)
        return setError('Veuillez remplir tous les champs obligatoires.') || false;
      if (!formData.nationalite)
        return setError('Veuillez sélectionner votre nationalité.') || false;
      if (formData.nationalite === 'Autre' && !formData.nationalite_autre.trim())
        return setError('Veuillez préciser votre nationalité.') || false;
      if (!formData.type_piece || !formData.numero_piece)
        return setError('Veuillez renseigner votre pièce d\'identité.') || false;
    }
    if (step === 2) {
      if (!formData.email || !formData.telephone)
        return setError('Veuillez renseigner votre email et votre téléphone.') || false;
      if (!formData.password || formData.password.length < 6)
        return setError('Le mot de passe doit contenir au moins 6 caractères.') || false;
      if (formData.password !== formData.password_confirm)
        return setError('Les mots de passe ne correspondent pas.') || false;
      if (!formData.ville)
        return setError('Veuillez sélectionner votre ville.') || false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.annees_experience || !formData.plateformes_vtc || !formData.situation_matrimoniale)
      return setError('Veuillez remplir tous les champs obligatoires.');
    if (!captchaToken)
      return setError('Veuillez valider la vérification anti-robot.');

    setLoading(true);
    try {
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
      const nationaliteFinale = formData.nationalite === 'Autre' ? formData.nationalite_autre.trim() : formData.nationalite;

      const response = await fetch(`${API_URL}/api/conducteurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          nom: formData.nom, prenom: formData.prenom, sexe: formData.sexe,
          date_naissance: formData.date_naissance, email: formData.email,
          telephone: formData.telephone, nationalite: nationaliteFinale,
          type_piece: formData.type_piece, numero_piece: formData.numero_piece,
          ville: formData.ville, commune: formData.commune, quartier: formData.quartier,
          annees_experience: formData.annees_experience, plateformes_vtc: formData.plateformes_vtc,
          situation_matrimoniale: formData.situation_matrimoniale,
          nombre_enfants: parseInt(formData.nombre_enfants) || 0,
          description: formData.description, captchaToken
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-wikya-blue mb-3">Compte créé avec succès !</h2>
          <p className="text-gray-600 mb-2">
            Un email de confirmation a été envoyé à <strong>{formData.email}</strong>.
          </p>
          <p className="text-gray-500 text-sm mb-6">
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-wikya-blue">Inscription Conducteur VTC</h1>
          <p className="text-gray-500 text-sm mt-1">Étape {step} sur {STEPS.length}</p>
        </div>

        <StepIndicator current={step} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

          {/* ÉTAPE 1 — Identité */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Votre identité</h2>
                <p className="text-sm text-gray-500">Ces informations seront vérifiées par notre équipe.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                  <input type="text" name="nom" value={formData.nom} required onChange={handleChange} className="input" placeholder="Ex: Kouassi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
                  <input type="text" name="prenom" value={formData.prenom} required onChange={handleChange} className="input" placeholder="Ex: Jean" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sexe *</label>
                  <select name="sexe" value={formData.sexe} required onChange={handleChange} className="input">
                    <option value="">Sélectionnez...</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de naissance *</label>
                  <input type="date" name="date_naissance" value={formData.date_naissance} required onChange={handleChange} className="input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationalité *</label>
                <select name="nationalite" value={formData.nationalite} required onChange={handleChange} className="input">
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
                  <input type="text" name="nationalite_autre" value={formData.nationalite_autre} required onChange={handleChange}
                    placeholder="Précisez votre nationalité" className="input mt-2" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de pièce *</label>
                  <select name="type_piece" value={formData.type_piece} required onChange={handleChange} className="input">
                    <option value="">Sélectionnez...</option>
                    <option value="CNI">CNI</option>
                    <option value="Passeport">Passeport</option>
                    <option value="Titre de séjour">Titre de séjour</option>
                    <option value="Carte consulaire">Carte consulaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Numéro de pièce *</label>
                  <input type="text" name="numero_piece" value={formData.numero_piece} required onChange={handleChange}
                    placeholder="Ex: CI0123456789" className="input" />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 — Contact & Localisation */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Contact & Localisation</h2>
                <p className="text-sm text-gray-500">Pour vous contacter et afficher votre zone d'activité.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input type="email" name="email" value={formData.email} required onChange={handleChange}
                  className="input" placeholder="votre@email.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                <PhoneInput name="telephone" value={formData.telephone} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe *</label>
                  <input type="password" name="password" value={formData.password} required onChange={handleChange}
                    className="input" placeholder="Min. 6 caractères" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer *</label>
                  <input type="password" name="password_confirm" value={formData.password_confirm} required onChange={handleChange}
                    className="input" placeholder="Répéter le mot de passe" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville *</label>
                  <select name="ville" value={formData.ville} required onChange={handleChange} className="input">
                    <option value="">Sélectionnez...</option>
                    {VILLES_CI.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Commune</label>
                  <select name="commune" value={formData.commune} onChange={handleChange} className="input">
                    <option value="">Si Abidjan...</option>
                    {COMMUNES_ABIDJAN.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quartier</label>
                <input type="text" name="quartier" value={formData.quartier} onChange={handleChange}
                  className="input" placeholder="Ex: Riviera 3" />
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Expérience & Finalisation */}
          {step === 3 && (
            <form id="form-step3" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">Expérience & Finalisation</h2>
                  <p className="text-sm text-gray-500">Dernières informations avant de créer votre profil.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Années d'expérience *</label>
                    <select name="annees_experience" value={formData.annees_experience} required onChange={handleChange} className="input">
                      <option value="">Sélectionnez...</option>
                      <option value="Moins d'1 an">Moins d'1 an</option>
                      {[...Array(15)].map((_, i) => (
                        <option key={i + 1} value={`${i + 1} an${i + 1 > 1 ? 's' : ''}`}>{i + 1} an{i + 1 > 1 ? 's' : ''}</option>
                      ))}
                      <option value="Plus de 15 ans">Plus de 15 ans</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dernière plateforme *</label>
                    <select name="plateformes_vtc" value={formData.plateformes_vtc} required onChange={handleChange} className="input">
                      <option value="">Sélectionnez...</option>
                      <option value="Yango">Yango</option>
                      <option value="Uber">Uber</option>
                      <option value="Heetch">Heetch</option>
                      <option value="Africab">Africab</option>
                      <option value="Taxijet">Taxijet</option>
                      <option value="Aucune">Aucune (nouveau)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Situation matrimoniale *</label>
                    <select name="situation_matrimoniale" value={formData.situation_matrimoniale} required onChange={handleChange} className="input">
                      <option value="">Sélectionnez...</option>
                      {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre d'enfants *</label>
                    <select name="nombre_enfants" value={formData.nombre_enfants} required onChange={handleChange} className="input">
                      {[...Array(13)].map((_, i) => (
                        <option key={i} value={i}>{i === 0 ? 'Aucun' : i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optionnel)</span></label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange}
                    className="input" placeholder="Parlez de vous, vos compétences, vos disponibilités..."></textarea>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <input type="checkbox" id="terms" required className="mt-0.5 shrink-0 w-4 h-4 accent-wikya-blue" />
                    <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                      J'ai lu et j'accepte les{' '}
                      <Link to="/conditions-generales" target="_blank" className="text-wikya-blue hover:underline font-semibold">CGU</Link>
                      {' '}et la{' '}
                      <Link to="/politique-confidentialite" target="_blank" className="text-wikya-blue hover:underline font-semibold">Politique de confidentialité</Link>
                      {' '}de Wikya.
                    </label>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <input type="checkbox" id="autorisation_donnees" required className="mt-0.5 shrink-0 w-4 h-4 accent-wikya-blue" />
                    <label htmlFor="autorisation_donnees" className="text-xs text-gray-600 leading-relaxed">
                      J'autorise Wikya à collecter et traiter mes données personnelles à des fins de mise en relation avec des recruteurs VTC.
                    </label>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setCaptchaToken(token)} />
                </div>
              </div>
            </form>
          )}

          {/* Navigation */}
          <div className={`flex mt-8 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <button type="button" onClick={prevStep}
                className="btn btn-outline flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep}
                className="btn btn-primary flex items-center gap-2 ml-auto">
                Continuer
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button type="submit" form="form-step3" disabled={loading}
                className="btn btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Inscription en cours...
                  </span>
                ) : "Créer mon compte"}
              </button>
            )}
          </div>

          {step === 1 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Déjà inscrit ?{' '}
              <Link to="/connexion" className="text-wikya-blue hover:underline font-semibold">Se connecter</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
