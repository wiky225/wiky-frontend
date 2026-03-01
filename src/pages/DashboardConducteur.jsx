import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

import API_URL from '../lib/api.js';

const TABS = [
  { id: 'profil', label: '👤 Mon Profil' },
  { id: 'stats', label: '📊 Mes Stats' },
  { id: 'avis', label: '💬 Mes Avis' },
  { id: 'documents', label: '🪪 Mes Documents' },
];

const EXPERIENCES = ["Moins d'1 an", '1-2 ans', '3-5 ans', '5-10 ans', 'Plus de 10 ans'];
const TYPES_COLLABORATION = ['Location simple', 'Achat progressif', 'CDI', 'CDD', 'Freelance'];
const PREFERENCES_YANGO = ['Yango Food', 'Yango Moto', 'Yango Light', 'Yango Business'];
const STATUTS = [
  { value: 'disponible', label: 'Disponible', color: 'bg-green-100 text-green-700' },
  { value: 'en poste', label: 'En poste', color: 'bg-orange-100 text-wikya-orange' },
  { value: 'indisponible', label: 'Indisponible', color: 'bg-gray-100 text-gray-500' },
];

function completionScore(profil) {
  const champs = [
    'prenom', 'nom', 'telephone', 'ville', 'commune',
    'annees_experience', 'plateformes_vtc', 'disponibilite',
    'description', 'photo_url', 'permis_recto_url',
  ];
  const remplis = champs.filter(c => profil[c] && profil[c] !== '').length;
  const collab = profil.type_collaboration?.length > 0 ? 1 : 0;
  return Math.round(((remplis + collab) / (champs.length + 1)) * 100);
}

function Etoiles({ note }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-lg leading-none ${i <= note ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
  );
}

// ── SIDEBAR ──────────────────────────────────────────────────
function Sidebar({ profil, activeTab, setActiveTab, onStatutChange }) {
  const score = completionScore(profil);
  const statut = STATUTS.find(s => s.value === profil.statut) || STATUTS[0];

  return (
    <aside className="w-full md:w-64 md:shrink-0 flex flex-col gap-3">
      {/* Photo + nom : ligne sur mobile, colonne sur desktop */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 md:flex-col md:items-center md:text-center md:gap-3 md:p-5">
        <img
          src={profil.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profil.prenom + ' ' + profil.nom)}&size=200&background=253b56&color=fff`}
          alt={`${profil.prenom} ${profil.nom}`}
          className="w-14 h-14 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-blue-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-wikya-blue leading-tight truncate">{profil.prenom} {profil.nom}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{profil.email}</p>
          <select
            value={profil.statut || 'disponible'}
            onChange={e => onStatutChange(e.target.value)}
            className={`mt-1.5 text-xs font-medium px-3 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${statut.color}`}
          >
            {STATUTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        {/* Lien profil public — icône seule sur mobile */}
        {profil.id && (
          <Link
            to={`/conducteur/${profil.id}`}
            title="Voir mon profil public"
            className="md:hidden shrink-0 text-wikya-blue border border-wikya-blue rounded-lg p-2 hover:bg-blue-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        )}
      </div>

      {/* Score de complétude */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-wikya-blue">Profil complété</span>
          <span className={`text-sm font-bold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-wikya-orange' : 'text-red-500'}`}>
            {score}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-wikya-orange' : 'bg-red-400'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        {score < 80 && (
          <p className="text-xs text-gray-400 mt-2">Complétez votre profil pour plus de visibilité.</p>
        )}
      </div>

      {/* Navigation onglets — grille 2×2 sur mobile, liste sur desktop */}
      <div className="bg-white rounded-xl shadow-sm p-2 grid grid-cols-2 md:flex md:flex-col gap-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-center md:text-left px-3 py-2.5 md:px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-wikya-blue text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lien profil public — visible uniquement sur desktop */}
      {profil.id && (
        <Link to={`/conducteur/${profil.id}`} className="hidden md:block btn btn-outline text-sm text-center">
          Voir mon profil public →
        </Link>
      )}
    </aside>
  );
}

// ── TAB PROFIL ────────────────────────────────────────────────
function TabProfil({ profil, session, onUpdate }) {
  const [form, setForm] = useState({
    prenom: profil.prenom || '',
    nom: profil.nom || '',
    telephone: profil.telephone || '',
    contact_secondaire: profil.contact_secondaire || '',
    personne_urgence: profil.personne_urgence || '',
    ville: profil.ville || '',
    commune: profil.commune || '',
    quartier: profil.quartier || '',
    annees_experience: profil.annees_experience || '',
    plateformes_vtc: profil.plateformes_vtc || '',
    disponibilite: profil.disponibilite || '',
    type_collaboration: profil.type_collaboration || [],
    preferences_yango: profil.preferences_yango || [],
    description: profil.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleList = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErreur('');
    setSucces(false);
    try {
      const res = await fetch(`${API_URL}/api/conducteurs/${profil.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
      }
      const updated = await res.json();
      onUpdate(updated);
      setSucces(true);
      setTimeout(() => setSucces(false), 3000);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Identité */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-wikya-blue mb-4">Identité</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
            <input value={form.prenom} onChange={e => set('prenom', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
            <input value={form.nom} onChange={e => set('nom', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
            <input value={form.telephone} onChange={e => set('telephone', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: 0707000000" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Contact secondaire</label>
            <input value={form.contact_secondaire} onChange={e => set('contact_secondaire', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Personne à contacter en urgence</label>
            <input value={form.personne_urgence} onChange={e => set('personne_urgence', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Nom + téléphone" />
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-wikya-blue mb-4">Localisation</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
            <input value={form.ville} onChange={e => set('ville', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Abidjan" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Commune</label>
            <input value={form.commune} onChange={e => set('commune', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Cocody" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Quartier</label>
            <input value={form.quartier} onChange={e => set('quartier', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Riviera" />
          </div>
        </div>
      </section>

      {/* Activité */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-wikya-blue mb-4">Activité VTC</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Années d'expérience</label>
            <select value={form.annees_experience} onChange={e => set('annees_experience', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Sélectionner</option>
              {EXPERIENCES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Disponibilité</label>
            <input value={form.disponibilite} onChange={e => set('disponibilite', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Lundi-Vendredi, 8h-18h" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Plateformes VTC</label>
            <input value={form.plateformes_vtc} onChange={e => set('plateformes_vtc', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Yango" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">Type de collaboration souhaité</label>
          <div className="flex flex-wrap gap-2">
            {TYPES_COLLABORATION.map(t => (
              <button
                key={t} type="button"
                onClick={() => toggleList('type_collaboration', t)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  form.type_collaboration.includes(t)
                    ? 'bg-wikya-blue text-white border-wikya-blue'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-wikya-blue'
                }`}
              >{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Type de service VTC</label>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES_YANGO.map(p => (
              <button
                key={p} type="button"
                onClick={() => toggleList('preferences_yango', p)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  form.preferences_yango.includes(p)
                    ? 'bg-wikya-orange text-white border-wikya-orange'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-wikya-orange'
                }`}
              >{p}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-wikya-blue mb-4">Description</h3>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
          placeholder="Parlez de vous, de votre expérience, de ce que vous recherchez..."
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </section>

      {erreur && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erreur}</div>
      )}
      {succes && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">✅ Profil mis à jour avec succès !</div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}

// ── TAB STATS ────────────────────────────────────────────────
function TabStats({ profil }) {
  const score = completionScore(profil);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="text-4xl mb-2">👁️</div>
          <div className="text-3xl font-bold text-wikya-blue">{profil.nb_vues ?? 0}</div>
          <div className="text-sm text-gray-500 mt-1">Vues du profil</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-wikya-blue">{profil.nb_favoris ?? 0}</div>
          <div className="text-sm text-gray-500 mt-1">Mis en favoris</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="text-4xl mb-2">💬</div>
          <div className="text-3xl font-bold text-wikya-blue">{profil.nb_avis ?? 0}</div>
          <div className="text-sm text-gray-500 mt-1">Avis reçus</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap gap-8 items-center">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Note moyenne</p>
          <p className="text-4xl font-bold text-wikya-blue">
            {profil.note_moyenne > 0 ? Number(profil.note_moyenne).toFixed(1) : '—'}
          </p>
          {profil.note_moyenne > 0 && (
            <div className="mt-1 flex justify-center">
              <Etoiles note={Math.round(profil.note_moyenne)} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-48 border-l pl-8">
          <p className="text-sm text-gray-500 mb-2">Complétude du profil</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-wikya-orange' : 'bg-red-400'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="font-bold text-wikya-blue text-sm">{score}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Un profil complet est 3× plus consulté</p>
        </div>
      </div>
    </div>
  );
}

// ── TAB AVIS ─────────────────────────────────────────────────
function TabAvis({ profilId }) {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/avis/${profilId}`)
      .then(r => r.json())
      .then(d => setAvis(Array.isArray(d) ? d : []))
      .catch(() => setAvis([]))
      .finally(() => setLoading(false));
  }, [profilId]);

  if (loading) return <div className="text-center py-12 text-gray-400">Chargement...</div>;

  if (avis.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
        <p className="text-4xl mb-3">💬</p>
        <p className="font-medium">Aucun avis pour le moment.</p>
        <p className="text-sm mt-1">Les recruteurs qui consultent votre profil pourront vous laisser un avis.</p>
      </div>
    );
  }

  const noteMoyenne = avis.reduce((s, a) => s + a.note, 0) / avis.length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-5">
        <span className="text-4xl font-bold text-wikya-blue">{noteMoyenne.toFixed(1)}</span>
        <div>
          <Etoiles note={Math.round(noteMoyenne)} />
          <p className="text-sm text-gray-500 mt-0.5">{avis.length} avis</p>
        </div>
      </div>
      {avis.map(a => (
        <div key={a.id} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <Etoiles note={a.note} />
            <span className="text-xs text-gray-400">
              {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          {a.badges?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {a.badges.map(b => (
                <span key={b} className="text-xs bg-gray-100 rounded-full px-2 py-1">{b}</span>
              ))}
            </div>
          )}
          {a.commentaire && <p className="text-gray-700 text-sm">{a.commentaire}</p>}
        </div>
      ))}
    </div>
  );
}

// ── TAB DOCUMENTS ────────────────────────────────────────────
function TabDocuments({ profil, session, onUpdate }) {
  const [uploading, setUploading] = useState({});
  const [erreur, setErreur] = useState('');

  const uploadFile = async (field, file) => {
    if (!file) return;
    setUploading(u => ({ ...u, [field]: true }));
    setErreur('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Erreur lors de l\'upload');
      const { url } = await uploadRes.json();

      const patchRes = await fetch(`${API_URL}/api/conducteurs/${profil.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: url }),
      });
      if (!patchRes.ok) throw new Error('Erreur lors de la sauvegarde');
      const updated = await patchRes.json();
      onUpdate(updated);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setUploading(u => ({ ...u, [field]: false }));
    }
  };

  const DocCard = ({ label, field, url, icon }) => (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-wikya-blue text-sm">{icon} {label}</h3>
        {url && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Uploadé</span>}
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block mb-3">
          <img src={url} alt={label} className="w-full max-h-40 object-contain rounded border bg-gray-50" />
        </a>
      ) : (
        <div className="w-full h-28 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center mb-3">
          <span className="text-3xl text-gray-300">{icon}</span>
        </div>
      )}
      <label className={`btn ${url ? 'btn-outline' : 'btn-primary'} text-sm w-full text-center cursor-pointer block ${uploading[field] ? 'opacity-60 pointer-events-none' : ''}`}>
        {uploading[field] ? 'Upload en cours...' : url ? 'Remplacer' : 'Ajouter'}
        <input type="file" accept="image/*" className="hidden" onChange={e => uploadFile(field, e.target.files[0])} />
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      {erreur && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erreur}</div>
      )}
      <div className="grid sm:grid-cols-3 gap-4">
        <DocCard label="Photo de profil" field="photo_url" url={profil.photo_url} icon="🖼️" />
        <DocCard label="Permis — recto" field="permis_recto_url" url={profil.permis_recto_url} icon="🪪" />
        <DocCard label="Permis — verso" field="permis_verso_url" url={profil.permis_verso_url} icon="🪪" />
      </div>
      <p className="text-xs text-gray-400 text-center">
        Les documents sont visibles uniquement par les recruteurs abonnés.
      </p>
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────
function DashboardConducteur() {
  const { user, session } = useAuth();
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profil');

  const fetchProfil = useCallback(async () => {
    try {
      let { data, error } = await supabase
        .from('conducteurs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data && user.email) {
        const { data: byEmail, error: emailError } = await supabase
          .from('conducteurs')
          .select('*')
          .eq('email', user.email)
          .is('user_id', null)
          .maybeSingle();

        if (emailError) throw emailError;

        if (byEmail) {
          await supabase.from('conducteurs').update({ user_id: user.id }).eq('id', byEmail.id);
          data = { ...byEmail, user_id: user.id };
        }
      }

      setProfil(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { if (user) fetchProfil(); }, [user, fetchProfil]);

  const handleUpdate = (updated) => setProfil(updated);

  const handleStatutChange = async (statut) => {
    if (!profil || !session?.access_token) return;
    try {
      const res = await fetch(`${API_URL}/api/conducteurs/${profil.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfil(updated);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-wikya-blue font-semibold">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur : {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Réessayer</button>
        </div>
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-wikya-blue mb-3">Profil non trouvé</h2>
          <p className="text-gray-500 mb-6">
            Votre profil conducteur n'a pas encore été créé. Cela peut arriver si vous venez de confirmer votre email.
          </p>
          <Link to="/inscription-conducteur" className="btn btn-primary w-full">
            Compléter mon inscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-wikya-blue">Bonjour, {profil.prenom} 👋</h1>
          <p className="text-gray-500 text-sm">Gérez votre profil et suivez vos statistiques.</p>
        </div>

        {/* Bannière abonnement */}
        {!profil.abonnement_actif ? (
          <div className="bg-wikya-blue text-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">🔒 Votre profil n'est pas encore contactable</p>
              <p className="text-blue-200 text-sm mt-0.5">
                Activez votre abonnement pour apparaître dans les résultats et recevoir des propositions.
              </p>
            </div>
            <Link
              to="/paiement?role=conducteur"
              className="btn bg-wikya-orange text-white hover:bg-wikya-orange-dark text-sm shrink-0"
            >
              S'abonner — 2 500 FCFA / 2 mois
            </Link>
          </div>
        ) : profil.date_fin_abonnement && Math.ceil((new Date(profil.date_fin_abonnement) - new Date()) / (1000 * 60 * 60 * 24)) <= 7 ? (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">
                ⚠️ Abonnement expirant dans {Math.ceil((new Date(profil.date_fin_abonnement) - new Date()) / (1000 * 60 * 60 * 24))} jour(s)
              </p>
              <p className="text-orange-600 text-sm mt-0.5">
                Renouvelez avant expiration pour rester contactable sans interruption.
              </p>
            </div>
            <Link
              to="/paiement?role=conducteur"
              className="btn bg-wikya-orange text-white hover:bg-wikya-orange-dark text-sm shrink-0"
            >
              Renouveler — 2 500 FCFA
            </Link>
          </div>
        ) : null}

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Sidebar
            profil={profil}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onStatutChange={handleStatutChange}
          />
          <main className="flex-1 min-w-0">
            {activeTab === 'profil' && (
              <TabProfil profil={profil} session={session} onUpdate={handleUpdate} />
            )}
            {activeTab === 'stats' && <TabStats profil={profil} />}
            {activeTab === 'avis' && <TabAvis profilId={profil.id} />}
            {activeTab === 'documents' && (
              <TabDocuments profil={profil} session={session} onUpdate={handleUpdate} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardConducteur;
