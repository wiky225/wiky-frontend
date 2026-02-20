import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HEURES_PRESETS = ['6h - 22h', '8h - 20h', '24h/24', 'Flexible'];
const TYPES_VEHICULES = ['Moto', 'Tricycle', 'Camionette', 'Véhicule standard', 'Véhicule électrique', 'Véhicule business'];

const formatMilliers = (val) => {
  const n = String(val).replace(/\D/g, '');
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
const parseMilliers = (val) => parseInt(String(val).replace(/\s/g, '')) || '';

function DashboardRecruteur() {
  const { session } = useAuth();
  const [abonnement, setAbonnement] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Offre
  const [offreEdit, setOffreEdit] = useState(false);
  const [offre, setOffre] = useState(null);
  const [offreSaving, setOffreSaving] = useState(false);
  const [offreSuccess, setOffreSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.access_token) return;

      try {
        const headers = { 'Authorization': `Bearer ${session.access_token}` };

        const [abonnementRes, favorisRes, profilRes] = await Promise.all([
          fetch(`${API_URL}/api/abonnements/check`, { headers }),
          fetch(`${API_URL}/api/favoris`, { headers }),
          fetch(`${API_URL}/api/recruteurs/me`, { headers })
        ]);

        if (!abonnementRes.ok) throw new Error(`Erreur abonnement : ${abonnementRes.status}`);
        if (!favorisRes.ok) throw new Error(`Erreur favoris : ${favorisRes.status}`);

        const [abonnementData, favorisData] = await Promise.all([
          abonnementRes.json(),
          favorisRes.json()
        ]);

        setAbonnement(abonnementData);
        setFavoris(favorisData);

        if (profilRes.ok) {
          const profilData = await profilRes.json();
          setProfil(profilData);
          setOffre({
            vehicules: profilData.vehicules ?? [],
            heures_travail: profilData.heures_travail ?? '',
            heures_custom_debut: '',
            heures_custom_fin: '',
            jours_travail: profilData.jours_travail ?? [],
            garde_vehicule: profilData.garde_vehicule ?? '',
            type_contrat: profilData.type_contrat ?? ''
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const toggleJour = (jour) => {
    setOffre(prev => ({
      ...prev,
      jours_travail: prev.jours_travail.includes(jour)
        ? prev.jours_travail.filter(j => j !== jour)
        : [...prev.jours_travail, jour]
    }));
  };

  const addVehicule = () => {
    setOffre(prev => ({
      ...prev,
      vehicules: [...prev.vehicules, { type: '', nombre: '', recette: '' }]
    }));
  };

  const updateVehicule = (index, field, value) => {
    setOffre(prev => {
      const updated = [...prev.vehicules];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, vehicules: updated };
    });
  };

  const removeVehicule = (index) => {
    setOffre(prev => ({
      ...prev,
      vehicules: prev.vehicules.filter((_, i) => i !== index)
    }));
  };

  const setHeuresPreset = (preset) => {
    setOffre(prev => ({ ...prev, heures_travail: preset, heures_custom_debut: '', heures_custom_fin: '' }));
  };

  const setHeuresCustom = (debut, fin) => {
    const val = debut && fin ? `${debut} - ${fin}` : '';
    setOffre(prev => ({ ...prev, heures_travail: val, heures_custom_debut: debut, heures_custom_fin: fin }));
  };

  const saveOffre = async () => {
    if (!profil?.id) return;
    setOffreSaving(true);
    setOffreSuccess(false);
    try {
      const payload = {
        heures_travail: offre.heures_travail,
        jours_travail: offre.jours_travail,
        garde_vehicule: offre.garde_vehicule,
        type_contrat: offre.type_contrat,
        vehicules: offre.vehicules
          .filter(v => v.type)
          .map(v => ({ type: v.type, nombre: parseInt(v.nombre) || 0, recette: parseInt(v.recette) || 0 }))
      };
      const res = await fetch(`${API_URL}/api/recruteurs/${profil.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setOffreEdit(false);
      setOffreSuccess(true);
      setTimeout(() => setOffreSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setOffreSaving(false);
    }
  };

  const joursRestants = () => {
    if (!abonnement?.date_fin) return 0;
    const diff = new Date(abonnement.date_fin) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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
            <div className="text-4xl mb-2">📅</div>
            <div className="text-3xl font-bold text-wiky-blue">
              {abonnement?.active ? `${joursRestants()}j` : '—'}
            </div>
            <div className="text-sm text-wiky-gray">Jours restants</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">{abonnement?.active ? '✅' : '❌'}</div>
            <div className="text-3xl font-bold text-wiky-blue">
              {abonnement?.active ? 'Actif' : 'Inactif'}
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
            <p className="text-red-600 mb-4">Aucun abonnement actif. Abonnez-vous pour accéder aux coordonnées des conducteurs.</p>
          )}
          <Link to="/paiement" className="btn btn-secondary">
            {abonnement?.active ? "Renouveler l'Abonnement" : "S'abonner — 10.000 FCFA/mois"}
          </Link>
        </div>

        {/* Mon offre */}
        {offre !== null && (
          <div className="card p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-wiky-blue">Mon Offre</h2>
              {!offreEdit ? (
                <button onClick={() => setOffreEdit(true)} className="btn btn-outline text-sm">
                  ✏️ Modifier
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setOffreEdit(false)} className="btn btn-outline text-sm">Annuler</button>
                  <button onClick={saveOffre} disabled={offreSaving} className="btn btn-primary text-sm disabled:opacity-60">
                    {offreSaving ? 'Sauvegarde...' : '✅ Sauvegarder'}
                  </button>
                </div>
              )}
            </div>

            {offreSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                ✅ Offre mise à jour avec succès !
              </div>
            )}

            {!offreEdit ? (
              /* Affichage */
              <div className="space-y-4 text-sm">
                {/* Véhicules */}
                <div>
                  <span className="font-semibold text-wiky-blue block mb-2">Flotte de véhicules :</span>
                  {offre.vehicules?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border rounded">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium text-gray-600">Type</th>
                            <th className="text-left px-3 py-2 font-medium text-gray-600">Nombre</th>
                            <th className="text-left px-3 py-2 font-medium text-gray-600">Recette/jour</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offre.vehicules.map((v, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-3 py-2">{v.type}</td>
                              <td className="px-3 py-2">{v.nombre}</td>
                              <td className="px-3 py-2">{Number(v.recette).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <span className="text-gray-400">Non renseigné</span>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div><span className="font-semibold text-wiky-blue">Heures de travail :</span> {offre.heures_travail || <span className="text-gray-400">Non renseigné</span>}</div>
                  <div>
                    <span className="font-semibold text-wiky-blue">Jours de travail :</span>{' '}
                    {offre.jours_travail?.length > 0 ? offre.jours_travail.join(', ') : <span className="text-gray-400">Non renseigné</span>}
                  </div>
                  <div><span className="font-semibold text-wiky-blue">Garde du véhicule :</span> {offre.garde_vehicule || <span className="text-gray-400">Non renseigné</span>}</div>
                  <div><span className="font-semibold text-wiky-blue">Type de contrat :</span> {offre.type_contrat || <span className="text-gray-400">Non renseigné</span>}</div>
                </div>
              </div>
            ) : (
              /* Formulaire d'édition */
              <div className="space-y-6">

                {/* Flotte de véhicules */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Flotte de véhicules</label>
                    <button type="button" onClick={addVehicule} className="text-sm text-wiky-blue hover:underline">+ Ajouter un type</button>
                  </div>
                  {offre.vehicules.length === 0 && (
                    <p className="text-gray-400 text-sm">Aucun véhicule ajouté.</p>
                  )}
                  <div className="space-y-2">
                    {offre.vehicules.map((v, i) => (
                      <div key={i} className="grid grid-cols-[1fr_80px_120px_32px] gap-2 items-center">
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
                          placeholder="25 000"
                          className="border rounded px-2 py-2 text-sm"
                        />
                        <button type="button" onClick={() => removeVehicule(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heures de travail */}
                <div>
                  <label className="block text-sm font-medium mb-2">Heures de travail</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {HEURES_PRESETS.map(p => (
                      <button key={p} type="button" onClick={() => setHeuresPreset(p)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${offre.heures_travail === p ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
                        {p}
                      </button>
                    ))}
                    <button type="button" onClick={() => setOffre(o => ({ ...o, heures_travail: 'custom' }))}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${!HEURES_PRESETS.includes(offre.heures_travail) && offre.heures_travail ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
                      Personnalisé
                    </button>
                  </div>
                  {(!HEURES_PRESETS.includes(offre.heures_travail) || offre.heures_travail === 'custom') && (
                    <div className="flex items-center gap-2 mt-2">
                      <input type="time" onChange={e => setHeuresCustom(e.target.value, offre.heures_custom_fin)} className="border rounded px-2 py-2 text-sm" />
                      <span className="text-gray-500">à</span>
                      <input type="time" onChange={e => setHeuresCustom(offre.heures_custom_debut, e.target.value)} className="border rounded px-2 py-2 text-sm" />
                    </div>
                  )}
                </div>

                {/* Jours de travail */}
                <div>
                  <label className="block text-sm font-medium mb-2">Jours de travail</label>
                  <div className="flex flex-wrap gap-2">
                    {JOURS.map(jour => (
                      <button key={jour} type="button" onClick={() => toggleJour(jour)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${offre.jours_travail.includes(jour) ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
                        {jour}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Garde du véhicule */}
                <div>
                  <label className="block text-sm font-medium mb-2">Garde du véhicule</label>
                  <div className="flex gap-3">
                    {['Avec le conducteur', 'À garer au dépôt'].map(opt => (
                      <button key={opt} type="button" onClick={() => setOffre(o => ({ ...o, garde_vehicule: opt }))}
                        className={`flex-1 py-2 px-3 rounded border text-sm transition-colors ${offre.garde_vehicule === opt ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type de contrat */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type de contrat</label>
                  <div className="flex flex-col gap-2">
                    {['Location simple (VTC uniquement)', 'Achat progressif (véhicule au conducteur après X ans)', 'Les deux propositions'].map(opt => (
                      <button key={opt} type="button" onClick={() => setOffre(o => ({ ...o, type_contrat: opt }))}
                        className={`py-2 px-4 rounded border text-sm text-left transition-colors ${offre.type_contrat === opt ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
