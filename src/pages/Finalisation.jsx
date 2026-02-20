import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export default function Finalisation() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [form, setForm] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/finaliser/${token}`);
        const data = await res.json();
        if (!res.ok) {
          if (data.already_done) { setAlreadyDone(true); return; }
          throw new Error(data.error || 'Lien invalide');
        }
        setForm({
          nom: data.nom || '',
          prenom: data.prenom || '',
          sexe: data.sexe || '',
          telephone: data.telephone || '',
          contact_secondaire: data.contact_secondaire || '',
          date_naissance: data.date_naissance || '',
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
      const res = await fetch(`${API_URL}/api/finaliser/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, password })
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Chargement de votre profil...</p>
    </div>
  );

  if (alreadyDone) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-wiky-blue mb-3">Profil déjà finalisé</h2>
        <p className="text-gray-600 mb-6">Votre compte est déjà activé. Connectez-vous pour accéder à votre espace.</p>
        <Link to="/connexion" className="btn btn-primary w-full">Se connecter</Link>
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
        <h2 className="text-2xl font-bold text-wiky-blue mb-3">Profil finalisé !</h2>
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
          <h1 className="text-3xl font-bold text-wiky-blue">Finalisez votre profil</h1>
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
            <h2 className="text-xl font-bold text-wiky-blue border-b pb-2">👤 Informations personnelles</h2>

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
                <input type="number" name="nombre_enfants" min="0" value={form.nombre_enfants} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wiky-blue border-b pb-2">📞 Contact</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone principal *</label>
                <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone secondaire</label>
                <input type="tel" name="contact_secondaire" value={form.contact_secondaire} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wiky-blue border-b pb-2">📍 Localisation</h2>
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
            <h2 className="text-xl font-bold text-wiky-blue border-b pb-2">🚗 Expérience professionnelle</h2>

            <div className="flex items-center gap-3">
              <input type="checkbox" name="experience_vtc" id="experience_vtc" checked={form.experience_vtc} onChange={handleChange} className="w-4 h-4" />
              <label htmlFor="experience_vtc" className="text-sm font-medium">J'ai déjà été chauffeur VTC</label>
            </div>

            {form.experience_vtc && (
              <div>
                <label className="block text-sm font-medium mb-1">Compagnie(s) précédente(s)</label>
                <input type="text" name="compagnie_precedente" value={form.compagnie_precedente} onChange={handleChange} placeholder="Ex: Yango, Uber" className="w-full border rounded px-3 py-2" />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Années d'expérience</label>
                <input type="text" name="annees_experience" value={form.annees_experience} onChange={handleChange} placeholder="Ex: 3 ans" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plateformes VTC utilisées</label>
                <input type="text" name="plateformes_vtc" value={form.plateformes_vtc} onChange={handleChange} placeholder="Ex: Yango, Bolt" className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Préférences Yango Pro</label>
              <div className="flex flex-wrap gap-2">
                {YANGO_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => toggleArray('preferences_yango', opt)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.preferences_yango.includes(opt) ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
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
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.type_collaboration.includes(opt) ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
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

          {/* Créer mon compte */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-wiky-blue border-b pb-2">🔐 Créer mon compte</h2>
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
