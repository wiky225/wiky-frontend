import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BADGES_POSITIFS = ['✅ Ponctuel', '✅ Professionnel', '✅ Bonne conduite', '✅ Expérimenté'];
const BADGES_NEGATIFS = ['⚠️ Non fiable', '❌ À éviter'];
const TOUS_BADGES = [...BADGES_POSITIFS, ...BADGES_NEGATIFS];

function Etoiles({ note, interactive = false, onSelect }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => interactive && onSelect(i)}
          className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        >
          {i <= note ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}

export default function ConducteurDetail() {
  const { id } = useParams();
  const { user, session } = useAuth();
  const [conducteur, setConducteur] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriId, setFavoriId] = useState(null);
  const [favoriLoading, setFavoriLoading] = useState(false);

  // Formulaire avis
  const [showAvisForm, setShowAvisForm] = useState(false);
  const [noteForm, setNoteForm] = useState(0);
  const [commentaireForm, setCommentaireForm] = useState('');
  const [badgesForm, setBadgesForm] = useState([]);
  const [avisLoading, setAvisLoading] = useState(false);
  const [avisSuccess, setAvisSuccess] = useState(false);

  const isRecruteur = user?.user_metadata?.role === 'recruteur';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [condRes, avisRes] = await Promise.all([
          fetch(`${API_URL}/api/conducteurs/${id}`),
          fetch(`${API_URL}/api/avis/${id}`)
        ]);
        if (!condRes.ok) throw new Error('Conducteur non trouvé');
        const [condData, avisData] = await Promise.all([condRes.json(), avisRes.json()]);
        setConducteur(condData);
        setAvis(avisData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  useEffect(() => {
    const checkFavori = async () => {
      if (!isRecruteur || !session?.access_token) return;
      try {
        const res = await fetch(`${API_URL}/api/favoris`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (!res.ok) return;
        const favoris = await res.json();
        const found = favoris.find(f => f.conducteurs?.id === id);
        if (found) setFavoriId(found.id);
      } catch {}
    };
    checkFavori();
  }, [id, isRecruteur, session]);

  const toggleFavori = async () => {
    if (!session?.access_token) return;
    setFavoriLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
      if (favoriId) {
        await fetch(`${API_URL}/api/favoris/${favoriId}`, { method: 'DELETE', headers });
        setFavoriId(null);
      } else {
        const res = await fetch(`${API_URL}/api/favoris`, { method: 'POST', headers, body: JSON.stringify({ conducteur_id: id }) });
        const data = await res.json();
        setFavoriId(data.id);
      }
    } catch {} finally {
      setFavoriLoading(false);
    }
  };

  const toggleBadge = (badge) => {
    const isNegatif = BADGES_NEGATIFS.includes(badge);
    setBadgesForm(prev => {
      if (prev.includes(badge)) return prev.filter(b => b !== badge);
      if (isNegatif) return [badge]; // Négatif seul, efface tout
      return [...prev.filter(b => !BADGES_NEGATIFS.includes(b)), badge]; // Retire les négatifs
    });
  };

  const submitAvis = async (e) => {
    e.preventDefault();
    if (!noteForm) return;
    setAvisLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/avis`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ conducteur_id: id, note: noteForm, commentaire: commentaireForm, badges: badgesForm })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur ${res.status}`);
      }
      const nouvelAvis = await res.json();
      setAvis(prev => [nouvelAvis, ...prev.filter(a => a.id !== nouvelAvis.id)]);
      setAvisSuccess(true);
      setShowAvisForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setAvisLoading(false);
    }
  };

  if (loading) return <div className="container-custom py-20 text-center">Chargement...</div>;
  if (error) return <div className="container-custom py-20 text-center text-red-600">{error}</div>;
  if (!conducteur) return <div className="container-custom py-20 text-center">Conducteur introuvable</div>;

  const noteMoyenne = conducteur.note_moyenne || 0;
  const nbAvis = conducteur.nb_avis || 0;

  // Compter les badges les plus fréquents
  const badgesCount = {};
  avis.forEach(a => (a.badges || []).forEach(b => { badgesCount[b] = (badgesCount[b] || 0) + 1; }));
  const topBadges = Object.entries(badgesCount).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([b]) => b);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <Link to="/repertoire" className="text-wiky-orange hover:underline mb-6 inline-block">← Retour au répertoire</Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img
                src={conducteur.photo_url || `https://ui-avatars.com/api/?name=${conducteur.prenom}+${conducteur.nom}&size=400&background=253b56&color=fff`}
                alt={`${conducteur.prenom} ${conducteur.nom}`}
                className="w-full rounded-lg"
              />
              {/* Note moyenne */}
              <div className="mt-4 text-center">
                <div className="flex justify-center mb-1">
                  <Etoiles note={Math.round(noteMoyenne)} />
                </div>
                <p className="text-wiky-blue font-bold text-xl">{noteMoyenne > 0 ? noteMoyenne.toFixed(1) : '—'}/5</p>
                <p className="text-sm text-gray-500">{nbAvis} avis</p>
              </div>
              {/* Top badges */}
              {topBadges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {topBadges.map(b => (
                    <span key={b} className="text-xs bg-gray-100 rounded-full px-3 py-1">{b}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-wiky-blue mb-2">{conducteur.prenom} {conducteur.nom}</h1>
              <p className="text-xl text-gray-600 mb-6">{conducteur.commune}, {conducteur.quartier}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-wiky-blue">📍 Localisation</h3>
                  <p>{conducteur.commune} - {conducteur.quartier}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-wiky-blue">⏱️ Expérience</h3>
                  <p>{conducteur.annees_experience}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-wiky-blue">🚕 Plateformes VTC</h3>
                  <p>{conducteur.plateformes_vtc}</p>
                </div>
                {conducteur.description && (
                  <div>
                    <h3 className="font-semibold text-wiky-blue">📝 Description</h3>
                    <p>{conducteur.description}</p>
                  </div>
                )}
                {conducteur.situation_matrimoniale && (
                  <div>
                    <h3 className="font-semibold text-wiky-blue">💍 Situation matrimoniale</h3>
                    <p>{conducteur.situation_matrimoniale}</p>
                  </div>
                )}
                {conducteur.nombre_enfants !== null && (
                  <div>
                    <h3 className="font-semibold text-wiky-blue">👶 Nombre d'enfants</h3>
                    <p>{conducteur.nombre_enfants}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-wiky-blue">📧 Contact</h3>
                  <p>Email: {conducteur.email}</p>
                  <p>Téléphone: {conducteur.telephone}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8 flex-wrap">
                <a
                  href={`https://wa.me/${conducteur.telephone?.replace(/\D/g, '').replace(/^0/, '225')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Contacter ce conducteur
                </a>
                {isRecruteur && (
                  <>
                    <button
                      onClick={toggleFavori}
                      disabled={favoriLoading}
                      className={`btn ${favoriId ? 'btn-outline' : 'btn-secondary'} disabled:opacity-60`}
                    >
                      {favoriLoading ? '...' : favoriId ? '⭐ Retirer des favoris' : '☆ Ajouter aux favoris'}
                    </button>
                    <button
                      onClick={() => { setShowAvisForm(!showAvisForm); setAvisSuccess(false); }}
                      className="btn btn-outline"
                    >
                      ✏️ Laisser un avis
                    </button>
                  </>
                )}
              </div>

              {/* Formulaire avis */}
              {showAvisForm && (
                <form onSubmit={submitAvis} className="mt-6 p-6 bg-gray-50 rounded-lg border space-y-4">
                  <h3 className="font-bold text-wiky-blue text-lg">Votre avis</h3>

                  <div>
                    <p className="text-sm font-semibold mb-2">Note *</p>
                    <Etoiles note={noteForm} interactive onSelect={setNoteForm} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {TOUS_BADGES.map(b => (
                        <button
                          key={b} type="button"
                          onClick={() => toggleBadge(b)}
                          className={`text-sm px-3 py-1 rounded-full border transition-colors ${badgesForm.includes(b) ? 'bg-wiky-blue text-white border-wiky-blue' : 'bg-white border-gray-300 hover:border-wiky-blue'}`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Commentaire</p>
                    <textarea
                      rows={3}
                      value={commentaireForm}
                      onChange={e => setCommentaireForm(e.target.value)}
                      placeholder="Décrivez votre expérience avec ce conducteur..."
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!noteForm || avisLoading}
                    className="btn btn-primary disabled:opacity-60"
                  >
                    {avisLoading ? 'Envoi...' : 'Publier mon avis'}
                  </button>
                </form>
              )}

              {avisSuccess && (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  ✅ Votre avis a été publié avec succès !
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section avis */}
        {avis.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-wiky-blue mb-6">Avis des recruteurs ({avis.length})</h2>
            <div className="space-y-4">
              {avis.slice(0, 3).map(a => (
                <div key={a.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Etoiles note={a.note} />
                    <span className="text-sm text-gray-400">
                      {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  {a.badges?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {a.badges.map(b => <span key={b} className="text-xs bg-gray-100 rounded-full px-2 py-1">{b}</span>)}
                    </div>
                  )}
                  {a.commentaire && <p className="text-gray-700">{a.commentaire}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
