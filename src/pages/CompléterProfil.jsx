import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import API_URL from '../lib/api.js';

const COMMUNES_ABIDJAN = [
  'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi',
  'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
  'Bingerville', 'Songon', 'Anyama',
];
const SITUATIONS = ['Célibataire', 'Fiancé(e)', 'Marié(e)', 'Veuf(ve)'];
const NATIONALITES = [
  'Ivoirien(ne)', 'Burkinabè', 'Malien(ne)', 'Guinéen(ne)', 'Sénégalais(e)',
  'Nigérien(ne)', 'Béninois(e)', 'Togolais(e)', 'Ghanéen(ne)', 'Nigérian(e)', 'Camerounais(e)',
];
const YANGO_OPTIONS = ['Moto', 'Tricycle', 'Camionette', 'Véhicule', 'GOYA'];
const COLLAB_OPTIONS = ['Conducteur salarié', 'Recette journalière', 'Véhicule au bout de 3 ans'];

const STEPS = [
  { number: 1, label: 'Identité' },
  { number: 2, label: 'Vie personnelle' },
  { number: 3, label: 'Expérience' },
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

export default function CompléterProfil() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingPermis, setUploadingPermis] = useState({ recto: false, verso: false });
  const [form, setForm] = useState({
    sexe: '', date_naissance: '',
    nationalite: '', nationalite_autre: '',
    type_piece: '', numero_piece: '',
    situation_matrimoniale: '', nombre_enfants: '',
    contact_secondaire: '',
    experience_vtc: false, compagnie_precedente: '',
    plateformes_vtc: '', annees_experience: '',
    preferences_yango: [], type_collaboration: [],
    disponibilite: '', description: '',
    permis_recto_url: '', permis_verso_url: '',
    autorisation_donnees: false,
  });

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleArray = (field, value) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter(v => v !== value) : [...f[field], value],
    }));
  };

  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!form.sexe || !form.date_naissance || !form.nationalite)
        return setError('Veuillez remplir tous les champs obligatoires.') || false;
      if (form.nationalite === 'Autre' && !form.nationalite_autre.trim())
        return setError('Veuillez préciser votre nationalité.') || false;
      if (!form.type_piece || !form.numero_piece)
        return setError('Veuillez renseigner votre pièce d\'identité.') || false;
    }
    if (step === 2) {
      if (!form.situation_matrimoniale || form.nombre_enfants === '')
        return setError('Veuillez remplir tous les champs obligatoires.') || false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => { setError(null); setStep(s => s - 1); };

  const handlePermisUpload = async (file, side) => {
    if (!file || !session?.access_token) return;
    setUploadingPermis(p => ({ ...p, [side]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/api/upload/permis`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur upload');
      setForm(f => ({ ...f, [`permis_${side}_url`]: data.url }));
    } catch (err) {
      setError(`Erreur upload permis ${side} : ${err.message}`);
    } finally {
      setUploadingPermis(p => ({ ...p, [side]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);

    try {
      const nationaliteFinale = form.nationalite === 'Autre'
        ? form.nationalite_autre.trim()
        : form.nationalite;

      const res = await fetch(`${API_URL}/api/conducteurs/moi/completer`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          nationalite: nationaliteFinale,
          nombre_enfants: parseInt(form.nombre_enfants) || 0,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Erreur lors de la finalisation');
      }

      navigate('/dashboard-conducteur', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-wikya-orange/10 text-wikya-orange text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Dernière étape avant l'accès à votre espace
          </div>
          <h1 className="text-2xl font-bold text-wikya-blue">Complétez votre profil</h1>
          <p className="text-gray-500 text-sm mt-1">Ces informations sont requises pour activer votre compte conducteur.</p>
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

          {/* ÉTAPE 1 — Identité & pièce */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Identité & pièce d'identité</h2>
                <p className="text-sm text-gray-500">Ces informations seront vérifiées par notre équipe.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sexe *</label>
                  <select name="sexe" value={form.sexe} onChange={handle} className="input" required>
                    <option value="">Sélectionnez...</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de naissance *</label>
                  <input type="date" name="date_naissance" value={form.date_naissance} onChange={handle}
                    className="input" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationalité *</label>
                <select name="nationalite" value={form.nationalite} onChange={handle} className="input" required>
                  <option value="">Sélectionnez...</option>
                  {NATIONALITES.map(n => <option key={n} value={n}>{n}</option>)}
                  <option value="Autre">Autre</option>
                </select>
                {form.nationalite === 'Autre' && (
                  <input type="text" name="nationalite_autre" value={form.nationalite_autre} onChange={handle}
                    placeholder="Précisez votre nationalité" className="input mt-2" required />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de pièce *</label>
                  <select name="type_piece" value={form.type_piece} onChange={handle} className="input" required>
                    <option value="">Sélectionnez...</option>
                    <option value="CNI">CNI</option>
                    <option value="Passeport">Passeport</option>
                    <option value="Titre de séjour">Titre de séjour</option>
                    <option value="Carte consulaire">Carte consulaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Numéro de pièce *</label>
                  <input type="text" name="numero_piece" value={form.numero_piece} onChange={handle}
                    placeholder="Ex: CI0123456789" className="input" required />
                </div>
              </div>

              {/* Permis de conduire */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Permis de conduire <span className="text-gray-400 font-normal">(optionnel)</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['recto', 'verso'].map(side => (
                    <div key={side}>
                      <p className="text-xs text-gray-500 mb-1 capitalize">Permis — {side}</p>
                      {form[`permis_${side}_url`] ? (
                        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-xs">
                          <span className="text-green-600">✅ Uploadé</span>
                          <button type="button" onClick={() => setForm(f => ({ ...f, [`permis_${side}_url`]: '' }))}
                            className="ml-auto text-red-400 hover:underline">Suppr.</button>
                        </div>
                      ) : (
                        <label className={`flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer text-xs transition-colors ${uploadingPermis[side] ? 'opacity-60 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-wikya-blue text-gray-400'}`}>
                          <input type="file" className="hidden" accept="image/*,.pdf"
                            disabled={uploadingPermis[side]}
                            onChange={e => handlePermisUpload(e.target.files[0], side)} />
                          {uploadingPermis[side] ? 'Envoi...' : 'Sélectionner'}
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 — Vie personnelle */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Vie personnelle</h2>
                <p className="text-sm text-gray-500">Informations personnelles requises par nos recruteurs partenaires.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Situation matrimoniale *</label>
                  <select name="situation_matrimoniale" value={form.situation_matrimoniale} onChange={handle} className="input" required>
                    <option value="">Sélectionnez...</option>
                    {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre d'enfants *</label>
                  <select name="nombre_enfants" value={form.nombre_enfants} onChange={handle} className="input" required>
                    <option value="">Sélectionnez...</option>
                    {[...Array(13)].map((_, i) => (
                      <option key={i} value={i}>{i === 0 ? 'Aucun' : i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Téléphone secondaire <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <PhoneInput name="contact_secondaire" value={form.contact_secondaire} onChange={handle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Commune <span className="text-gray-400 font-normal">(si Abidjan)</span>
                </label>
                <select name="commune" value={form.commune || ''} onChange={handle} className="input">
                  <option value="">Sélectionnez...</option>
                  {COMMUNES_ABIDJAN.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <input type="checkbox" id="autorisation_donnees" name="autorisation_donnees"
                  checked={form.autorisation_donnees} onChange={handle}
                  className="mt-0.5 shrink-0 w-4 h-4 accent-wikya-blue" />
                <label htmlFor="autorisation_donnees" className="text-xs text-gray-600 leading-relaxed">
                  J'autorise Wikya à collecter et traiter mes données personnelles à des fins de mise en relation avec des recruteurs VTC.
                </label>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Expérience & finalisation */}
          {step === 3 && (
            <form id="form-step3" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">Expérience professionnelle</h2>
                  <p className="text-sm text-gray-500">Aidez les recruteurs à mieux vous connaître.</p>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="experience_vtc" name="experience_vtc"
                    checked={form.experience_vtc} onChange={handle} className="w-4 h-4 accent-wikya-blue" />
                  <label htmlFor="experience_vtc" className="text-sm font-medium text-gray-700">
                    J'ai déjà été chauffeur VTC
                  </label>
                </div>

                {form.experience_vtc && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Compagnie(s) précédente(s)</label>
                    <input type="text" name="compagnie_precedente" value={form.compagnie_precedente} onChange={handle}
                      placeholder="Ex: Yango, Uber..." className="input" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Années d'expérience</label>
                    <select name="annees_experience" value={form.annees_experience} onChange={handle} className="input">
                      <option value="">Sélectionnez...</option>
                      <option value="Moins d'1 an">Moins d'1 an</option>
                      {[...Array(15)].map((_, i) => (
                        <option key={i + 1} value={`${i + 1} an${i + 1 > 1 ? 's' : ''}`}>
                          {i + 1} an{i + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                      <option value="Plus de 15 ans">Plus de 15 ans</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dernière plateforme</label>
                    <select name="plateformes_vtc" value={form.plateformes_vtc} onChange={handle} className="input">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de service VTC</label>
                  <div className="flex flex-wrap gap-2">
                    {YANGO_OPTIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => toggleArray('preferences_yango', opt)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.preferences_yango.includes(opt) ? 'bg-wikya-blue text-white border-wikya-blue' : 'bg-white border-gray-300 hover:border-wikya-blue'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de collaboration souhaité</label>
                  <div className="flex flex-wrap gap-2">
                    {COLLAB_OPTIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => toggleArray('type_collaboration', opt)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.type_collaboration.includes(opt) ? 'bg-wikya-blue text-white border-wikya-blue' : 'bg-white border-gray-300 hover:border-wikya-blue'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea name="description" rows="3" value={form.description} onChange={handle}
                    className="input" placeholder="Parlez de vous, vos compétences, vos disponibilités..." />
                </div>
              </div>
            </form>
          )}

          {/* Navigation */}
          <div className={`flex mt-8 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn btn-outline flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary flex items-center gap-2 ml-auto">
                Continuer
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button type="submit" form="form-step3" disabled={loading}
                className="btn btn-primary flex-1 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Enregistrement...
                  </span>
                ) : 'Accéder à mon espace →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
