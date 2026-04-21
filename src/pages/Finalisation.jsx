import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
const YANGO_OPTIONS = ['Moto', 'Tricycle', 'Camionette', 'Véhicule', 'GOYA'];
const COLLAB_OPTIONS = ['Conducteur salarié', 'Recette journalière', 'Véhicule au bout de 3 ans'];
const NATIONALITES = [
  'Ivoirien(ne)', 'Burkinabè', 'Malien(ne)', 'Guinéen(ne)', 'Sénégalais(e)',
  'Nigérien(ne)', 'Béninois(e)', 'Togolais(e)', 'Ghanéen(ne)', 'Nigérian(e)', 'Camerounais(e)'
];

export default function Finalisation() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [expired, setExpired] = useState(false);
  const [form, setForm] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [uploadingPermis, setUploadingPermis] = useState({ recto: false, verso: false });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/finaliser/${token}`);
        const data = await res.json();
        if (!res.ok) {
          if (data.already_done) { setAlreadyDone(true); return; }
          if (data.expired) { setExpired(true); return; }
          throw new Error(data.error || 'Lien invalide');
        }
        const nat = data.nationalite || '';
        const natConnue = NATIONALITES.includes(nat);
        setForm({
          nom: data.nom || '',
          prenom: data.prenom || '',
          sexe: data.sexe || '',
          telephone: data.telephone || '',
          contact_secondaire: data.contact_secondaire || '',
          date_naissance: data.date_naissance || '',
          nationalite: natConnue || !nat ? nat : 'Autre',
          nationalite_autre: !natConnue && nat ? nat : '',
          ville: data.ville || '',
          commune: data.commune || '',
          quartier: data.quartier || '',
          situation_matrimoniale: data.situation_matrimoniale || '',
          nombre_enfants: data.nombre_enfants ?? '',
          experience_vtc: data.experience_vtc || false,
          compagnie_precedente: data.compagnie_precedente || '',
          preferences_yango: data.preferences_yango || [],
          type_collaboration: data.type_collaboration || [],
          disponibilite: data.disponibilite || '',
          annees_experience: data.annees_experience || '',
          plateformes_vtc: data.plateformes_vtc || '',
          description: data.description || '',
          permis_recto_url: data.permis_recto_url || '',
          permis_verso_url: data.permis_verso_url || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleArray = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setSubmitting(true);
    try {
      const nationaliteFinale = form.nationalite === 'Autre' ? form.nationalite_autre.trim() : form.nationalite;
      const res = await fetch(`${API_URL}/api/finaliser/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, nationalite: nationaliteFinale, password })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.already_done) { setAlreadyDone(true); return; }
        throw new Error(data.error || 'Erreur lors de la finalisation');
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePermisUpload = async (file, side) => {
    if (!file) return;
    setUploadingPermis(prev => ({ ...prev, [side]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/api/finaliser/${token}/upload-permis`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur upload');
      setForm(prev => ({ ...prev, [`permis_${side}_url`]: data.url }));
    } catch (err) {
      setError(`Erreur upload permis ${side} : ${err.message}`);
    } finally {
      setUploadingPermis(prev => ({ ...prev, [side]: false }));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Chargement de votre profil...</p>
    </div>
  );

  if (alreadyDone) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-wikya-blue mb-3">Profil déjà finalisé</h2>
        <p className="text-gray-600 mb-6">Votre compte est déjà activé. Connectez-vous pour accéder à votre espace.</p>
        <Link to="/connexion" className="btn btn-primary w-full">Se connecter</Link>
      </div>
    </div>
  );

  if (expired) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-5xl mb-4">⏰</div>
        <h2 className="text-2xl font-bold text-orange-500 mb-3">Lien expiré</h2>
        <p className="text-gray-600 mb-2">Ce lien de finalisation n'est plus valide.</p>
        <p className="text-gray-600 mb-6">Contactez l'équipe Wikya pour recevoir un nouveau lien.</p>
        <a href="https://wa.me/2250575421717" className="btn btn-primary w-full">Contacter Wikya sur WhatsApp</a>
      </div>
    </div>
  );

  if (error && !form) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-red-600 mb-3">Lien invalide</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-wikya-blue mb-3">Profil finalisé !</h2>
        <p className="text-gray-600 mb-2">Votre compte est maintenant actif.</p>
        <p className="text-gray-600 mb-6">Connectez-vous pour accéder à votre espace conducteur.</p>
        <Link to="/connexion" className="btn btn-primary w-full">Se connecter</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wikya-blue">Finalisez votre profil</h1>
          <p className="text-gray-600 mt-2">Vérifiez vos informations, complétez votre profil et créez votre mot de passe.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue border-b pb-2">👤 Informations personnelles</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prénoms *</label>
                <input type="text" name="prenom" value={form.prenom} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sexe *</label>
                <select name="sexe" value={form.sexe} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de naissance</label>
                <input type="date" name="date_naissance" value={form.date_naissance} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Situation matrimoniale</label>
                <select name="situation_matrimoniale" value={form.situation_matrimoniale} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre d'enfants</label>
                <select name="nombre_enfants" value={form.nombre_enfants} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  {[...Array(13)].map((_, i) => (
                    <option key={i} value={i}>{i === 0 ? 'Aucun' : i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Identité */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue border-b pb-2">🪪 Pièce d'identité</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nationalité *</label>
                <select name="nationalite" value={form.nationalite || ''} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  {NATIONALITES.map(n => <option key={n} value={n}>{n}</option>)}
                  <option value="Autre">Autre</option>
                </select>
                {form.nationalite === 'Autre' && (
                  <input
                    type="text"
                    name="nationalite_autre"
                    value={form.nationalite_autre || ''}
                    onChange={handleChange}
                    required
                    placeholder="Précisez votre nationalité"
                    className="w-full border rounded px-3 py-2 mt-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type de pièce *</label>
                <select name="type_piece" value={form.type_piece || ''} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  <option value="CNI">CNI</option>
                  <option value="Passeport">Passeport</option>
                  <option value="Titre de séjour">Titre de séjour</option>
                  <option value="Carte consulaire">Carte consulaire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de pièce *</label>
                <input type="text" name="numero_piece" value={form.numero_piece || ''} onChange={handleChange} required placeholder="Ex: CI0123456789" className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue border-b pb-2">📞 Contact</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone principal *</label>
                <PhoneInput name="telephone" value={form.telephone} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone secondaire</label>
                <PhoneInput name="contact_secondaire" value={form.contact_secondaire} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue border-b pb-2">📍 Localisation <span className="text-sm font-normal text-gray-500">(lieu de résidence)</span></h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ville *</label>
                <select name="ville" value={form.ville} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  {VILLES_CI.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Commune (si Abidjan)</label>
                <select name="commune" value={form.commune} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  {COMMUNES_ABIDJAN.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quartier</label>
              <input type="text" name="quartier" value={form.quartier} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          {/* Expérience professionnelle */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue border-b pb-2">🚗 Expérience professionnelle</h2>

            <div className="flex items-center gap-3">
              <input type="checkbox" name="experience_vtc" id="experience_vtc" checked={form.experience_vtc} onChange={handleChange} className="w-4 h-4" />
              <label htmlFor="experience_vtc" className="text-sm font-medium">J'ai déjà été chauffeur VTC</label>
            </div>

            {form.experience_vtc && (
              <div>
                <label className="block text-sm font-medium mb-1">Compagnie(s) précédente(s)</label>
                <input type="text" name="compagnie_precedente" value={form.compagnie_precedente} onChange={handleChange} placeholder="Ex: Yango" className="w-full border rounded px-3 py-2" />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Années d'expérience</label>
                <select name="annees_experience" value={form.annees_experience} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  <option value="Moins d'1 an">Moins d'1 an</option>
                  {[...Array(15)].map((_, i) => (
                    <option key={i + 1} value={`${i + 1} an${i + 1 > 1 ? 's' : ''}`}>{i + 1} an{i + 1 > 1 ? 's' : ''}</option>
                  ))}
                  <option value="Plus de 15 ans">Plus de 15 ans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dernière plateforme utilisée</label>
                <select name="plateformes_vtc" value={form.plateformes_vtc} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Sélectionnez...</option>
                  <option value="Yango">Yango</option>
                  <option value="Uber">Uber</option>
                  <option value="Heetch">Heetch</option>
                  <option value="Africab">Africab</option>
                  <option value="Taxijet">Taxijet</option>
                  <option value="Aucune">Aucune (nouveau conducteur)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type de service VTC</label>
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
              <label className="block text-sm font-medium mb-2">Type de collaboration souhaité</label>
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
              <label className="block text-sm font-medium mb-1">Disponibilité</label>
              <input type="text" name="disponibilite" value={form.disponibilite} onChange={handleChange} placeholder="Ex: Immédiate, Dans 1 mois..." className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (facultatif)</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Parlez de vous, vos compétences..." className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          {/* Documents — Permis de conduire */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue border-b pb-2">📄 Permis de conduire</h2>
            <p className="text-sm text-gray-500">Prenez une photo de votre permis (recto et verso). Formats acceptés : JPG, PNG — 10 Mo max.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {['recto', 'verso'].map(side => (
                <div key={side}>
                  <label className="block text-sm font-medium mb-1 capitalize">Permis — {side}</label>
                  {form[`permis_${side}_url`] ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                      <span className="text-green-600 text-sm">✅ Fichier uploadé</span>
                      <a href={form[`permis_${side}_url`]} target="_blank" rel="noreferrer" className="text-xs text-wikya-blue underline">Voir</a>
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, [`permis_${side}_url`]: '' }))}
                        className="ml-auto text-xs text-red-500 hover:underline">Supprimer</button>
                    </div>
                  ) : (
                    <label className={`flex items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${uploadingPermis[side] ? 'opacity-60 cursor-not-allowed border-gray-300' : 'border-gray-300 hover:border-wikya-blue'}`}>
                      <input type="file" className="hidden" accept="image/*"
                        disabled={uploadingPermis[side]}
                        onChange={e => handlePermisUpload(e.target.files[0], side)} />
                      {uploadingPermis[side]
                        ? <span className="text-sm text-gray-500">Envoi en cours...</span>
                        : <span className="text-sm text-gray-500">Cliquez pour sélectionner un fichier</span>}
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Créer mon compte */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue border-b pb-2">🔐 Créer mon compte</h2>
            <p className="text-sm text-gray-500">Choisissez un mot de passe pour accéder à votre espace conducteur.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmer le mot de passe *</label>
                <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full text-lg py-4 disabled:opacity-60"
          >
            {submitting ? 'Finalisation en cours...' : '✅ Finaliser mon profil'}
          </button>
        </form>
      </div>
    </div>
  );
}
