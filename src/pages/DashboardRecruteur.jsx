import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HEURES_PRESETS = ['6h - 22h', '8h - 20h', '24h/24', 'Flexible'];
const TYPES_VEHICULES = ['Moto', 'Tricycle', 'Camionette', 'Véhicule standard', 'Véhicule électrique', 'Véhicule business'];
const TYPES_CONTRAT = ['Location simple (VTC uniquement)', 'Achat progressif (véhicule au conducteur après X ans)', 'Les deux propositions'];
const GARDE_OPTIONS = ['Avec le conducteur', 'À garer au dépôt'];

const formatMilliers = (val) => String(val).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const parseMilliers = (val) => parseInt(String(val).replace(/\s/g, '')) || '';

const emptyOffre = () => ({
  titre: '', vehicules: [], heures_travail: '',
  jours_travail: [], garde_vehicule: '', type_contrat: ''
});

// ── FORMULAIRE OFFRE ──────────────────────────────────────────
function FormulaireOffre({ form, setForm, onSave, onCancel, saving, error }) {
  const toggleJour = (jour) => setForm(prev => ({
    ...prev,
    jours_travail: prev.jours_travail.includes(jour)
      ? prev.jours_travail.filter(j => j !== jour)
      : [...prev.jours_travail, jour]
  }));

  const addVehicule = () => setForm(prev => ({
    ...prev, vehicules: [...prev.vehicules, { type: '', nombre: '', recette: '' }]
  }));

  const updateVehicule = (i, field, value) => setForm(prev => {
    const updated = [...prev.vehicules];
    updated[i] = { ...updated[i], [field]: value };
    return { ...prev, vehicules: updated };
  });

  const removeVehicule = (i) => setForm(prev => ({
    ...prev, vehicules: prev.vehicules.filter((_, idx) => idx !== i)
  }));

  const isCustomHeures = form.heures_travail && !HEURES_PRESETS.includes(form.heures_travail);

  return (
    <div className="bg-gray-50 border rounded-xl p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Titre <span className="text-gray-400 font-normal">(optionnel)</span></label>
        <input type="text" value={form.titre}
          onChange={e => setForm(prev => ({ ...prev, titre: e.target.value }))}
          placeholder="Ex: Flotte moto, Véhicule standard..."
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wiky-blue" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Flotte de véhicules</label>
          <button type="button" onClick={addVehicule} className="text-sm text-wiky-blue hover:underline">+ Ajouter</button>
        </div>
        {form.vehicules.length === 0 && <p className="text-gray-400 text-sm">Aucun véhicule ajouté.</p>}
        <div className="space-y-2">
          {form.vehicules.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_64px] sm:grid-cols-[1fr_80px_150px_32px] gap-2 items-start">
              <select value={v.type} onChange={e => updateVehicule(i, 'type', e.target.value)} className="border rounded px-2 py-2 text-sm">
                <option value="">Type...</option>
                {TYPES_VEHICULES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" min="1" value={v.nombre} onChange={e => updateVehicule(i, 'nombre', e.target.value)} placeholder="Nb" className="border rounded px-2 py-2 text-sm" />
              <input type="text" value={formatMilliers(v.recette)} onChange={e => updateVehicule(i, 'recette', parseMilliers(e.target.value))} placeholder="Recette FCFA/j" className="border rounded px-2 py-2 text-sm col-span-2 sm:col-span-1" />
              <button type="button" onClick={() => removeVehicule(i)} className="text-red-400 hover:text-red-600 text-xl leading-none hidden sm:block">×</button>
              <button type="button" onClick={() => removeVehicule(i)} className="text-xs text-red-400 hover:text-red-600 underline sm:hidden col-span-2 text-left">Supprimer</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Heures de travail</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {HEURES_PRESETS.map(p => (
            <button key={p} type="button" onClick={() => setForm(prev => ({ ...prev, heures_travail: p }))}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.heures_travail === p ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
              {p}
            </button>
          ))}
          <button type="button" onClick={() => setForm(prev => ({ ...prev, heures_travail: 'custom' }))}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${isCustomHeures ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
            Personnalisé
          </button>
        </div>
        {(isCustomHeures || form.heures_travail === 'custom') && (
          <div className="flex items-center gap-2 mt-2">
            <input type="time" className="border rounded px-2 py-2 text-sm"
              onChange={e => {
                const fin = form.heures_travail.includes(' - ') ? form.heures_travail.split(' - ')[1] : '';
                setForm(prev => ({ ...prev, heures_travail: fin ? `${e.target.value} - ${fin}` : e.target.value }));
              }} />
            <span className="text-gray-500">à</span>
            <input type="time" className="border rounded px-2 py-2 text-sm"
              onChange={e => {
                const debut = form.heures_travail.includes(' - ') ? form.heures_travail.split(' - ')[0] : '';
                setForm(prev => ({ ...prev, heures_travail: debut ? `${debut} - ${e.target.value}` : e.target.value }));
              }} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Jours de travail</label>
        <div className="flex flex-wrap gap-2">
          {JOURS.map(jour => (
            <button key={jour} type="button" onClick={() => toggleJour(jour)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.jours_travail.includes(jour) ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
              {jour}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Garde du véhicule</label>
        <div className="flex gap-3">
          {GARDE_OPTIONS.map(opt => (
            <button key={opt} type="button" onClick={() => setForm(prev => ({ ...prev, garde_vehicule: opt }))}
              className={`flex-1 py-2 px-3 rounded border text-sm transition-colors ${form.garde_vehicule === opt ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Type de contrat</label>
        <div className="flex flex-col gap-2">
          {TYPES_CONTRAT.map(opt => (
            <button key={opt} type="button" onClick={() => setForm(prev => ({ ...prev, type_contrat: opt }))}
              className={`py-2 px-4 rounded border text-sm text-left transition-colors ${form.type_contrat === opt ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Erreur : {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="btn btn-outline text-sm">Annuler</button>
        <button onClick={onSave} disabled={saving} className="btn btn-primary text-sm disabled:opacity-60">
          {saving ? 'Sauvegarde...' : '✅ Enregistrer'}
        </button>
      </div>
    </div>
  );
}

// ── CARTE OFFRE ───────────────────────────────────────────────
function CarteOffreRecruteur({ offre, index, onEdit, onDelete }) {
  const totalVehicules = (offre.vehicules || []).reduce((s, v) => s + (parseInt(v.nombre) || 0), 0);
  const titre = offre.titre || `Offre #${index + 1}`;
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-bold text-wiky-blue">{titre}</h3>
          {totalVehicules > 0 && <p className="text-xs text-gray-500">{totalVehicules} véhicule{totalVehicules > 1 ? 's' : ''}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onEdit(offre)} className="text-xs px-3 py-1.5 border border-wiky-blue text-wiky-blue rounded-lg hover:bg-blue-50">✏️ Modifier</button>
          <button onClick={() => onDelete(offre.id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Supprimer</button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {offre.vehicules?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border rounded text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-1.5 font-medium text-gray-500">Type</th>
                  <th className="text-left px-3 py-1.5 font-medium text-gray-500">Nb</th>
                  <th className="text-left px-3 py-1.5 font-medium text-gray-500">Recette/jour</th>
                </tr>
              </thead>
              <tbody>
                {offre.vehicules.map((v, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1.5">{v.type}</td>
                    <td className="px-3 py-1.5">{v.nombre}</td>
                    <td className="px-3 py-1.5 font-semibold text-wiky-blue">{Number(v.recette).toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid grid-cols-2 gap-1 text-gray-600 text-xs pt-1">
          {offre.heures_travail && <span>🕐 {offre.heures_travail}</span>}
          {offre.jours_travail?.length > 0 && <span>📅 {offre.jours_travail.length === 7 ? 'Tous les jours' : offre.jours_travail.join(', ')}</span>}
          {offre.garde_vehicule && <span className="col-span-2">🚗 {offre.garde_vehicule}</span>}
          {offre.type_contrat && <span className="col-span-2">📄 {offre.type_contrat}</span>}
        </div>
      </div>
    </div>
  );
}

// ── ONGLET OFFRES ─────────────────────────────────────────────
function TabOffres({ session, offres, fetchOffres }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formOffre, setFormOffre] = useState(emptyOffre());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const headers = () => ({
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json'
  });

  const startNew = () => { setEditingId(null); setFormOffre(emptyOffre()); setError(null); setShowForm(true); };
  const startEdit = (o) => { setEditingId(o.id); setFormOffre({ titre: o.titre || '', vehicules: o.vehicules || [], heures_travail: o.heures_travail || '', jours_travail: o.jours_travail || [], garde_vehicule: o.garde_vehicule || '', type_contrat: o.type_contrat || '' }); setError(null); setShowForm(true); };

  const saveOffre = async () => {
    setSaving(true); setError(null);
    try {
      const payload = { ...formOffre, vehicules: formOffre.vehicules.filter(v => v.type).map(v => ({ type: v.type, nombre: parseInt(v.nombre) || 0, recette: parseInt(v.recette) || 0 })) };
      const url = editingId ? `${API_URL}/api/offres/${editingId}` : `${API_URL}/api/offres`;
      const res = await fetch(url, { method: editingId ? 'PATCH' : 'POST', headers: headers(), body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `Erreur ${res.status}`); }
      setShowForm(false); setEditingId(null); await fetchOffres();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const deleteOffre = async (id) => {
    if (!confirm('Supprimer cette offre ?')) return;
    await fetch(`${API_URL}/api/offres/${id}`, { method: 'DELETE', headers: headers() });
    await fetchOffres();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{offres.length} offre{offres.length > 1 ? 's' : ''} publiée{offres.length > 1 ? 's' : ''}</p>
        {!showForm && <button onClick={startNew} className="btn btn-primary text-sm">+ Nouvelle offre</button>}
      </div>

      {showForm && (
        <div>
          <h3 className="font-semibold text-wiky-blue mb-3">{editingId ? "Modifier l'offre" : 'Nouvelle offre'}</h3>
          <FormulaireOffre form={formOffre} setForm={setFormOffre} onSave={saveOffre}
            onCancel={() => { setShowForm(false); setEditingId(null); setError(null); }} saving={saving} error={error} />
        </div>
      )}

      {offres.length === 0 && !showForm ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">💼</p>
          <p className="text-gray-500 mb-4">Vous n'avez pas encore d'offre publiée.</p>
          <button onClick={startNew} className="btn btn-primary text-sm">Créer ma première offre</button>
        </div>
      ) : (
        <div className="space-y-4">
          {offres.map((o, i) => <CarteOffreRecruteur key={o.id} offre={o} index={i} onEdit={startEdit} onDelete={deleteOffre} />)}
        </div>
      )}
    </div>
  );
}

// ── ONGLET FAVORIS ────────────────────────────────────────────
function TabFavoris({ favoris }) {
  if (favoris.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">❤️</p>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore de favoris.</p>
        <Link to="/repertoire" className="btn btn-primary text-sm">Parcourir le répertoire</Link>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {favoris.map((favori) => {
        const c = favori.conducteurs;
        return (
          <Link key={favori.id} to={`/conducteur/${c?.id}`}
            className="flex items-center gap-4 p-4 border rounded-xl hover:bg-wiky-gray-light transition-colors">
            <img src={c?.photo_url || `https://ui-avatars.com/api/?name=${c?.prenom}+${c?.nom}&size=80&background=253b56&color=fff`}
              alt={`${c?.prenom} ${c?.nom}`} className="w-14 h-14 rounded-full object-cover shrink-0" />
            <div>
              <p className="font-bold text-wiky-blue">{c?.prenom} {c?.nom}</p>
              <p className="text-sm text-wiky-gray">{c?.commune}{c?.annees_experience ? ` — ${c.annees_experience}` : ''}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ── ONGLET PROFIL ─────────────────────────────────────────────
function TabProfil({ profil, session, onUpdate }) {
  const [form, setForm] = useState({
    type_recruteur: profil?.type_recruteur || 'particulier',
    nom_entreprise: profil?.nom_entreprise || '',
    nom_responsable: profil?.nom_responsable || '',
    prenom_responsable: profil?.prenom_responsable || '',
    telephone: profil?.telephone || '',
    email: profil?.email || ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const save = async () => {
    setSaving(true); setSuccess(false); setError(null);
    try {
      const res = await fetch(`${API_URL}/api/recruteurs/${profil.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `Erreur ${res.status}`); }
      setSuccess(true);
      onUpdate(await res.json());
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Type de recruteur</label>
        <div className="flex gap-3">
          {['particulier', 'entreprise'].map(t => (
            <button key={t} type="button" onClick={() => setForm(prev => ({ ...prev, type_recruteur: t }))}
              className={`flex-1 py-2 px-3 rounded border text-sm capitalize transition-colors ${form.type_recruteur === t ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
              {t === 'entreprise' ? '🏢 Entreprise' : '👤 Particulier'}
            </button>
          ))}
        </div>
      </div>

      {form.type_recruteur === 'entreprise' && (
        <div>
          <label className="block text-sm font-medium mb-1">Nom de l'entreprise</label>
          <input value={form.nom_entreprise} onChange={e => setForm(p => ({ ...p, nom_entreprise: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wiky-blue" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <input value={form.prenom_responsable} onChange={e => setForm(p => ({ ...p, prenom_responsable: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wiky-blue" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input value={form.nom_responsable} onChange={e => setForm(p => ({ ...p, nom_responsable: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wiky-blue" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Téléphone</label>
        <input value={form.telephone} onChange={e => setForm(p => ({ ...p, telephone: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wiky-blue" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input value={form.email} disabled
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
        <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié ici.</p>
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">✅ Profil mis à jour !</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">Erreur : {error}</div>}

      <button onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-60">
        {saving ? 'Sauvegarde...' : '✅ Enregistrer les modifications'}
      </button>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────
function Sidebar({ abonnement, offres, favoris, profil }) {
  const joursRestants = () => {
    if (!abonnement?.date_fin) return 0;
    return Math.max(0, Math.ceil((new Date(abonnement.date_fin) - new Date()) / (1000 * 60 * 60 * 24)));
  };
  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const jours = joursRestants();
  const abonnementWarning = abonnement?.active && jours <= 7;

  return (
    <div className="space-y-4">
      {/* Abonnement */}
      <div className={`rounded-xl p-5 ${abonnementWarning ? 'bg-orange-50 border border-orange-200' : 'bg-white border'}`}>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Abonnement</h3>
        {abonnement?.active ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              <span className="font-bold text-green-700">Actif</span>
            </div>
            <p className={`text-sm mb-1 ${abonnementWarning ? 'text-orange-700 font-semibold' : 'text-gray-500'}`}>
              {abonnementWarning ? `⚠️ Expire dans ${jours} jour${jours > 1 ? 's' : ''} !` : `${jours} jours restants`}
            </p>
            <p className="text-xs text-gray-400 mb-3">jusqu'au {formatDate(abonnement.date_fin)}</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
              <span className="font-bold text-red-600">Inactif</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Abonnez-vous pour accéder aux contacts.</p>
          </>
        )}
        <Link to="/paiement" className={`text-xs font-semibold px-3 py-1.5 rounded-lg block text-center transition-colors ${abonnement?.active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-wiky-orange text-white hover:bg-wiky-orange-dark'}`}>
          {abonnement?.active ? 'Renouveler' : "S'abonner — 10 000 FCFA"}
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">En un coup d'œil</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">💼 Offres publiées</span>
            <span className="font-bold text-wiky-blue">{offres.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">❤️ Favoris</span>
            <span className="font-bold text-wiky-blue">{favoris.length}</span>
          </div>
        </div>
      </div>

      {/* Lien répertoire */}
      <Link to="/repertoire"
        className="flex items-center gap-3 bg-wiky-blue text-white rounded-xl p-4 hover:bg-wiky-blue-dark transition-colors">
        <span className="text-2xl">🔍</span>
        <div>
          <p className="font-semibold text-sm">Trouver un conducteur</p>
          <p className="text-xs text-blue-200">Parcourir le répertoire</p>
        </div>
      </Link>
    </div>
  );
}

// ── DASHBOARD PRINCIPAL ───────────────────────────────────────
const TABS = [
  { id: 'offres', label: '💼 Mes Offres' },
  { id: 'favoris', label: '❤️ Mes Favoris' },
  { id: 'profil', label: '👤 Mon Profil' },
];

export default function DashboardRecruteur() {
  const { session } = useAuth();
  const [abonnement, setAbonnement] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [profil, setProfil] = useState(null);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('offres');

  const fetchOffres = useCallback(async () => {
    if (!session?.access_token) return;
    const res = await fetch(`${API_URL}/api/offres/me`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });
    if (res.ok) setOffres(await res.json());
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.access_token) return;
      try {
        const h = { 'Authorization': `Bearer ${session.access_token}` };
        const [abonnementRes, favorisRes, profilRes] = await Promise.all([
          fetch(`${API_URL}/api/abonnements/check`, { headers: h }),
          fetch(`${API_URL}/api/favoris`, { headers: h }),
          fetch(`${API_URL}/api/recruteurs/me`, { headers: h })
        ]);
        if (!abonnementRes.ok) throw new Error(`Erreur abonnement : ${abonnementRes.status}`);
        if (!favorisRes.ok) throw new Error(`Erreur favoris : ${favorisRes.status}`);
        const [abonnementData, favorisData] = await Promise.all([abonnementRes.json(), favorisRes.json()]);
        setAbonnement(abonnementData);
        setFavoris(favorisData);
        if (profilRes.ok) setProfil(await profilRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchOffres();
  }, [session, fetchOffres]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-wiky-gray-light">
      <div className="text-wiky-blue font-semibold">Chargement...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-wiky-gray-light">
      <div className="text-center">
        <p className="text-red-600 mb-4">Erreur : {error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Réessayer</button>
      </div>
    </div>
  );

  const prenom = profil?.prenom_responsable || '';

  return (
    <div className="min-h-screen bg-wiky-gray-light">
      {/* Header */}
      <div className="bg-wiky-blue text-white py-6 px-8">
        <h1 className="text-2xl font-bold">
          {prenom ? `Bonjour, ${prenom} 👋` : 'Mon Dashboard Recruteur'}
        </h1>
        <p className="text-blue-200 text-sm mt-1">
          {profil?.type_recruteur === 'entreprise' ? profil.nom_entreprise : 'Espace recruteur'}
        </p>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar gauche */}
          <div className="md:w-60 shrink-0">
            <Sidebar abonnement={abonnement} offres={offres} favoris={favoris} profil={profil} />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Onglets */}
            <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm border overflow-x-auto">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 sm:flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-wiky-blue text-white shadow-sm' : 'text-gray-500 hover:text-wiky-blue'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu de l'onglet */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {activeTab === 'offres' && (
                <TabOffres session={session} offres={offres} fetchOffres={fetchOffres} />
              )}
              {activeTab === 'favoris' && (
                <TabFavoris favoris={favoris} />
              )}
              {activeTab === 'profil' && profil && (
                <TabProfil profil={profil} session={session} onUpdate={setProfil} />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
