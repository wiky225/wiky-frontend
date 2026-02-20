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
  titre: '',
  vehicules: [],
  heures_travail: '',
  jours_travail: [],
  garde_vehicule: '',
  type_contrat: ''
});

// ── FORMULAIRE OFFRE ──────────────────────────────────────────
function FormulaireOffre({ form, setForm, onSave, onCancel, saving, error }) {
  const toggleJour = (jour) => {
    setForm(prev => ({
      ...prev,
      jours_travail: prev.jours_travail.includes(jour)
        ? prev.jours_travail.filter(j => j !== jour)
        : [...prev.jours_travail, jour]
    }));
  };

  const addVehicule = () => setForm(prev => ({
    ...prev,
    vehicules: [...prev.vehicules, { type: '', nombre: '', recette: '' }]
  }));

  const updateVehicule = (i, field, value) => setForm(prev => {
    const updated = [...prev.vehicules];
    updated[i] = { ...updated[i], [field]: value };
    return { ...prev, vehicules: updated };
  });

  const removeVehicule = (i) => setForm(prev => ({
    ...prev,
    vehicules: prev.vehicules.filter((_, idx) => idx !== i)
  }));

  const isCustomHeures = form.heures_travail && !HEURES_PRESETS.includes(form.heures_travail);

  return (
    <div className="bg-gray-50 border rounded-xl p-6 space-y-6">
      {/* Titre */}
      <div>
        <label className="block text-sm font-medium mb-1">Titre de l'offre <span className="text-gray-400 font-normal">(optionnel)</span></label>
        <input
          type="text"
          value={form.titre}
          onChange={e => setForm(prev => ({ ...prev, titre: e.target.value }))}
          placeholder="Ex: Offre véhicule standard, Flotte moto..."
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wiky-blue"
        />
      </div>

      {/* Véhicules */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Flotte de véhicules</label>
          <button type="button" onClick={addVehicule} className="text-sm text-wiky-blue hover:underline">
            + Ajouter un type
          </button>
        </div>
        {form.vehicules.length === 0 && (
          <p className="text-gray-400 text-sm">Aucun véhicule ajouté.</p>
        )}
        <div className="space-y-2">
          {form.vehicules.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_140px_32px] gap-2 items-center">
              <select
                value={v.type}
                onChange={e => updateVehicule(i, 'type', e.target.value)}
                className="border rounded px-2 py-2 text-sm"
              >
                <option value="">Type...</option>
                {TYPES_VEHICULES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                type="number" min="1"
                value={v.nombre}
                onChange={e => updateVehicule(i, 'nombre', e.target.value)}
                placeholder="Nb"
                className="border rounded px-2 py-2 text-sm"
              />
              <input
                type="text"
                value={formatMilliers(v.recette)}
                onChange={e => updateVehicule(i, 'recette', parseMilliers(e.target.value))}
                placeholder="25 000 FCFA/j"
                className="border rounded px-2 py-2 text-sm"
              />
              <button type="button" onClick={() => removeVehicule(i)} className="text-red-400 hover:text-red-600 text-xl leading-none">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Heures */}
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

      {/* Jours */}
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

      {/* Garde */}
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

      {/* Contrat */}
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

      {/* Actions */}
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
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-wiky-blue text-lg">{titre}</h3>
          {totalVehicules > 0 && (
            <p className="text-sm text-gray-500">{totalVehicules} véhicule{totalVehicules > 1 ? 's' : ''}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onEdit(offre)} className="text-xs px-3 py-1.5 border border-wiky-blue text-wiky-blue rounded-lg hover:bg-blue-50">
            ✏️ Modifier
          </button>
          <button onClick={() => onDelete(offre.id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            Supprimer
          </button>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        {offre.vehicules?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border rounded text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-gray-500">Type</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-500">Nb</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-500">Recette/jour</th>
                </tr>
              </thead>
              <tbody>
                {offre.vehicules.map((v, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{v.type}</td>
                    <td className="px-3 py-2">{v.nombre}</td>
                    <td className="px-3 py-2 font-semibold text-wiky-blue">{Number(v.recette).toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          {offre.heures_travail && <span>🕐 {offre.heures_travail}</span>}
          {offre.jours_travail?.length > 0 && (
            <span>📅 {offre.jours_travail.length === 7 ? 'Tous les jours' : offre.jours_travail.join(', ')}</span>
          )}
          {offre.garde_vehicule && <span className="col-span-2">🚗 {offre.garde_vehicule}</span>}
          {offre.type_contrat && <span className="col-span-2">📄 {offre.type_contrat}</span>}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD PRINCIPAL ───────────────────────────────────────
function DashboardRecruteur() {
  const { session } = useAuth();
  const [abonnement, setAbonnement] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Multi-offres
  const [offres, setOffres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formOffre, setFormOffre] = useState(emptyOffre());
  const [offreSaving, setOffreSaving] = useState(false);
  const [offreError, setOffreError] = useState(null);

  const headers = useCallback(() => ({
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json'
  }), [session]);

  const fetchOffres = useCallback(async () => {
    if (!session?.access_token) return;
    const res = await fetch(`${API_URL}/api/offres/me`, { headers: { 'Authorization': `Bearer ${session.access_token}` } });
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

        const [abonnementData, favorisData] = await Promise.all([
          abonnementRes.json(),
          favorisRes.json()
        ]);

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

  const startNew = () => {
    setEditingId(null);
    setFormOffre(emptyOffre());
    setShowForm(true);
  };

  const startEdit = (offre) => {
    setEditingId(offre.id);
    setFormOffre({
      titre: offre.titre || '',
      vehicules: offre.vehicules || [],
      heures_travail: offre.heures_travail || '',
      jours_travail: offre.jours_travail || [],
      garde_vehicule: offre.garde_vehicule || '',
      type_contrat: offre.type_contrat || ''
    });
    setShowForm(true);
  };

  const saveOffre = async () => {
    setOffreSaving(true);
    setOffreError(null);
    try {
      const payload = {
        ...formOffre,
        vehicules: formOffre.vehicules
          .filter(v => v.type)
          .map(v => ({ type: v.type, nombre: parseInt(v.nombre) || 0, recette: parseInt(v.recette) || 0 }))
      };

      const url = editingId ? `${API_URL}/api/offres/${editingId}` : `${API_URL}/api/offres`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(payload) });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur ${res.status}`);
      }

      setShowForm(false);
      setEditingId(null);
      await fetchOffres();
    } catch (err) {
      setOffreError(err.message);
    } finally {
      setOffreSaving(false);
    }
  };

  const deleteOffre = async (id) => {
    if (!confirm('Supprimer cette offre ?')) return;
    await fetch(`${API_URL}/api/offres/${id}`, { method: 'DELETE', headers: headers() });
    await fetchOffres();
  };

  const joursRestants = () => {
    if (!abonnement?.date_fin) return 0;
    return Math.max(0, Math.ceil((new Date(abonnement.date_fin) - new Date()) / (1000 * 60 * 60 * 24)));
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wiky-gray-light">
        <div className="text-wiky-blue font-semibold">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wiky-gray-light">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur : {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-wiky-blue mb-8">Mon Dashboard Recruteur</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-wiky-blue">{favoris.length}</div>
            <div className="text-sm text-wiky-gray">Favoris</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">💼</div>
            <div className="text-3xl font-bold text-wiky-blue">{offres.length}</div>
            <div className="text-sm text-wiky-gray">Offre{offres.length > 1 ? 's' : ''} publiée{offres.length > 1 ? 's' : ''}</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">{abonnement?.active ? '✅' : '❌'}</div>
            <div className="text-3xl font-bold text-wiky-blue">
              {abonnement?.active ? `${joursRestants()}j` : 'Inactif'}
            </div>
            <div className="text-sm text-wiky-gray">Abonnement</div>
          </div>
        </div>

        {/* Abonnement */}
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-bold text-wiky-blue mb-4">Mon Abonnement</h2>
          {abonnement?.active ? (
            <p className="text-wiky-gray mb-4">
              Actif jusqu'au <span className="font-semibold">{formatDate(abonnement.date_fin)}</span>
            </p>
          ) : (
            <p className="text-red-600 mb-4">
              Aucun abonnement actif. Abonnez-vous pour accéder aux coordonnées des conducteurs.
            </p>
          )}
          <Link to="/paiement" className="btn btn-secondary">
            {abonnement?.active ? "Renouveler l'Abonnement" : "S'abonner — 10.000 FCFA/mois"}
          </Link>
        </div>

        {/* Mes offres */}
        <div className="card p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-wiky-blue">Mes Offres</h2>
              <p className="text-sm text-gray-500 mt-1">{offres.length} offre{offres.length > 1 ? 's' : ''} publiée{offres.length > 1 ? 's' : ''}</p>
            </div>
            {!showForm && (
              <button onClick={startNew} className="btn btn-primary text-sm">
                + Nouvelle offre
              </button>
            )}
          </div>

          {showForm && (
            <div className="mb-6">
              <h3 className="font-semibold text-wiky-blue mb-4">
                {editingId ? 'Modifier l\'offre' : 'Créer une nouvelle offre'}
              </h3>
              <FormulaireOffre
                form={formOffre}
                setForm={setFormOffre}
                onSave={saveOffre}
                onCancel={() => { setShowForm(false); setEditingId(null); setOffreError(null); }}
                saving={offreSaving}
                error={offreError}
              />
            </div>
          )}

          {offres.length === 0 && !showForm ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">💼</p>
              <p className="text-gray-500 mb-4">Vous n'avez pas encore d'offre publiée.</p>
              <button onClick={startNew} className="btn btn-primary text-sm">
                Créer ma première offre
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {offres.map((offre, i) => (
                <CarteOffreRecruteur
                  key={offre.id}
                  offre={offre}
                  index={i}
                  onEdit={startEdit}
                  onDelete={deleteOffre}
                />
              ))}
            </div>
          )}
        </div>

        {/* Favoris */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-wiky-blue mb-6">
            Mes Favoris ({favoris.length})
          </h2>
          {favoris.length === 0 ? (
            <p className="text-wiky-gray">
              Vous n'avez pas encore de favoris.{' '}
              <Link to="/repertoire" className="text-wiky-blue hover:text-wiky-orange font-semibold">
                Parcourir le répertoire
              </Link>
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {favoris.map((favori) => {
                const c = favori.conducteurs;
                return (
                  <Link
                    key={favori.id}
                    to={`/conducteur/${c?.id}`}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-wiky-gray-light transition-colors"
                  >
                    <img
                      src={c?.photo_url || `https://ui-avatars.com/api/?name=${c?.prenom}+${c?.nom}&size=80&background=253b56&color=fff`}
                      alt={`${c?.prenom} ${c?.nom}`}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-wiky-blue">{c?.prenom} {c?.nom}</p>
                      <p className="text-sm text-wiky-gray">{c?.commune} — {c?.annees_experience}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardRecruteur;
