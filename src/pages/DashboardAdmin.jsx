import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import API_URL from '../lib/api.js';

const TABS = [
  { id: 'stats', label: '📊 Vue d\'ensemble' },
  { id: 'conducteurs', label: '🚗 Conducteurs' },
  { id: 'recruteurs', label: '🏢 Recruteurs' },
  { id: 'avis', label: '⭐ Avis' },
  { id: 'whatsapp', label: '📱 WhatsApp' },
  { id: 'import', label: '📥 Import CSV' },
  { id: 'annonces', label: '📢 Publicités' }
];

const FORMATS = [
  { value: 'medium_rectangle', label: 'Medium Rectangle (300×250)' },
  { value: 'leaderboard', label: 'Leaderboard (728×90)' },
  { value: 'mobile_banner', label: 'Mobile Banner (320×50)' },
  { value: 'half_page', label: 'Half Page (300×600)' },
];

const POSITIONS = [
  { value: 'repertoire-inline', label: 'Répertoire (entre les conducteurs)' },
  { value: 'offres-inline', label: 'Page Offres (entre les offres)' },
  { value: 'home-leaderboard', label: 'Accueil (leaderboard)' },
  { value: 'conducteur-sidebar', label: 'Profil conducteur (sidebar)' },
];

function StatCard({ label, value, sub, color = 'blue' }) {
  const colors = { blue: 'border-wikya-blue text-wikya-blue', orange: 'border-wikya-orange text-wikya-orange', green: 'border-green-500 text-green-600', gray: 'border-gray-400 text-gray-500' };
  return (
    <div className={`bg-white rounded-lg shadow p-5 border-l-4 ${colors[color]}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── VUE D'ENSEMBLE ──────────────────────────────────────────
function TabStats({ token, notifications = [], unreadCount = 0, markNotifRead, markAllRead }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setStats);
  }, [token]);

  if (!stats) return <p className="text-gray-400">Chargement...</p>;
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-wikya-blue">Conducteurs</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.conducteurs.total} color="blue" />
        <StatCard label="Finalisés" value={stats.conducteurs.finalises} color="green" />
        <StatCard label="Non finalisés" value={stats.conducteurs.non_finalises} color="orange" />
        <StatCard label="Archivés" value={stats.conducteurs.archives} color="gray" />
      </div>
      <h2 className="text-xl font-bold text-wikya-blue">Recruteurs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total" value={stats.recruteurs.total} color="blue" />
        <StatCard label="Abonnés actifs" value={stats.recruteurs.abonnes} color="green" />
        <StatCard label="Avis publiés" value={stats.avis.total} color="orange" />
      </div>

      {/* ── Notifications internes ── */}
      {notifications.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-wikya-blue">
              Finalisations récentes
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 align-middle">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </h2>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-sm text-wikya-blue hover:underline">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-center justify-between p-3 rounded-lg border ${n.lu ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                <div>
                  <p className={`text-sm font-medium ${n.lu ? 'text-gray-600' : 'text-wikya-blue'}`}>
                    {!n.lu && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 align-middle" />}
                    {n.titre}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.lu && (
                  <button onClick={() => markNotifRead(n.id)} className="text-xs text-blue-600 hover:underline ml-4 shrink-0">
                    ✓ Lu
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CONDUCTEURS ──────────────────────────────────────────────
function TabConducteurs({ token }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 50, offset: 0 });
    if (search) params.set('search', search);
    if (filtre === 'finalise') params.set('finalise', 'true');
    if (filtre === 'non_finalise') params.set('finalise', 'false');
    if (filtre === 'archive') params.set('statut', 'archivé');
    const res = await fetch(`${API_URL}/api/admin/conducteurs?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    setData(json.data || []);
    setTotal(json.total || 0);
    setLoading(false);
  }, [token, search, filtre]);

  useEffect(() => { load(); }, [load]);

  const updateStatut = async (id, statut) => {
    await fetch(`${API_URL}/api/admin/conducteurs/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut })
    });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="border rounded px-3 py-2 flex-1 min-w-[200px]" />
        <select value={filtre} onChange={e => setFiltre(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Tous</option>
          <option value="finalise">Finalisés</option>
          <option value="non_finalise">Non finalisés</option>
          <option value="archive">Archivés</option>
        </select>
        <button onClick={load} className="btn btn-outline">🔄 Actualiser</button>
      </div>
      <p className="text-sm text-gray-500">{total} conducteur(s)</p>
      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Nom</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Téléphone</th>
                <th className="text-left p-3">Statut</th>
                <th className="text-left p-3">Finalisé</th>
                <th className="text-left p-3">Permis</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{c.nom} {c.prenom}</td>
                  <td className="p-3 text-gray-500">{c.email}</td>
                  <td className="p-3">{c.telephone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${c.statut === 'archivé' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                      {c.statut}
                    </span>
                  </td>
                  <td className="p-3">
                    {c.inscription_finalisee
                      ? <span className="text-green-600">✅</span>
                      : <span className="text-orange-500">⏳</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {c.permis_recto_url
                        ? <a href={c.permis_recto_url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">R</a>
                        : <span className="text-xs text-gray-300">—</span>}
                      {c.permis_verso_url
                        ? <a href={c.permis_verso_url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">V</a>
                        : null}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {c.statut !== 'archivé'
                        ? <button onClick={() => updateStatut(c.id, 'archivé')} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Archiver</button>
                        : <button onClick={() => updateStatut(c.id, 'disponible')} className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100">Restaurer</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── RECRUTEURS ───────────────────────────────────────────────
function TabRecruteurs({ token }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 50 });
    if (search) params.set('search', search);
    const res = await fetch(`${API_URL}/api/admin/recruteurs?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    setData(json.data || []);
    setTotal(json.total || 0);
    setLoading(false);
  }, [token, search]);

  useEffect(() => { load(); }, [load]);

  const toggleAbonnement = async (id, actif) => {
    const date_fin = actif ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;
    await fetch(`${API_URL}/api/admin/recruteurs/${id}/abonnement`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ actif, date_fin })
    });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="border rounded px-3 py-2 flex-1" />
        <button onClick={load} className="btn btn-outline">🔄 Actualiser</button>
      </div>
      <p className="text-sm text-gray-500">{total} recruteur(s)</p>
      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Nom</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Abonnement</th>
                <th className="text-left p-3">Expire le</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{r.nom} {r.prenom}</td>
                  <td className="p-3 text-gray-500">{r.email}</td>
                  <td className="p-3 capitalize">{r.type_recruteur || 'particulier'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${r.abonnement_actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {r.abonnement_actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">
                    {r.date_fin_abonnement ? new Date(r.date_fin_abonnement).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="p-3">
                    {r.abonnement_actif
                      ? <button onClick={() => toggleAbonnement(r.id, false)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Désactiver</button>
                      : <button onClick={() => toggleAbonnement(r.id, true)} className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100">Activer 30j</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── AVIS ─────────────────────────────────────────────────────
function TabAvis({ token }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/avis?limit=50`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    setData(json.data || []);
    setTotal(json.total || 0);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const deleteAvis = async (id) => {
    if (!confirm('Supprimer cet avis ?')) return;
    await fetch(`${API_URL}/api/admin/avis/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{total} avis</p>
        <button onClick={load} className="btn btn-outline">🔄 Actualiser</button>
      </div>
      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="space-y-3">
          {data.map(a => (
            <div key={a.id} className="bg-white rounded-lg border p-4 flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{a.conducteurs?.nom} {a.conducteurs?.prenom}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(a.note)}</span>
                </div>
                {a.badges?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {a.badges.map(b => <span key={b} className="text-xs bg-gray-100 rounded-full px-2 py-0.5">{b}</span>)}
                  </div>
                )}
                {a.commentaire && <p className="text-sm text-gray-600">{a.commentaire}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Par {a.recruteurs?.nom} {a.recruteurs?.prenom} · {new Date(a.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button onClick={() => deleteAvis(a.id)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 shrink-0">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── WHATSAPP ─────────────────────────────────────────────────
function TabWhatsapp({ token }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTel, setEditTel] = useState('');
  const [savingTel, setSavingTel] = useState(false);
  const [search, setSearch] = useState('');
  const [filtreTel, setFiltreTel] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/whatsapp`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    setData(Array.isArray(json) ? json : []);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // Génère le lien wa.me avec le message pré-rempli
  const waLink = (telephone, message) => {
    let phone = (telephone || '').replace(/\D/g, ''); // garde uniquement les chiffres
    if (!phone) return null;
    // Normalisation Côte d'Ivoire : +225 suivi d'un chiffre non-zéro → insérer le 0
    // Exemples : 2257XXXXXXXX → 22507XXXXXXXX / 2255XXXXXXXX → 22505XXXXXXXX
    if (phone.startsWith('225') && phone.length === 11 && phone[3] !== '0') {
      phone = '2250' + phone.substring(3);
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const copyMessage = (i, message) => {
    navigator.clipboard.writeText(message);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const startEdit = (d) => {
    setEditingId(d.id);
    setEditTel(d.telephone || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTel('');
  };

  const saveTelephone = async (id) => {
    if (!editTel.trim()) return;
    setSavingTel(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/conducteurs/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ telephone: editTel.trim() }),
      });
      if (!res.ok) throw new Error('Erreur sauvegarde');
      // Mise à jour locale immédiate sans recharger toute la liste
      setData(prev => prev.map(d => d.id === id ? { ...d, telephone: editTel.trim() } : d));
      setEditingId(null);
      setEditTel('');
    } catch (err) {
      alert('Erreur : ' + err.message);
    } finally {
      setSavingTel(false);
    }
  };

  const exportCSV = () => {
    const lines = ['Prenom,Nom,Telephone,Email,Lien,Message',
      ...data.map(d => `"${d.prenom}","${d.nom}","${d.telephone || ''}","${d.email}","${d.lien}","${d.message.replace(/"/g, '""')}"`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'whatsapp_finalisation.csv'; a.click();
  };

  const FRONTEND_URL = 'https://wikya.ci';

  // Message campagne conducteurs
  const messageCampagne = `Bonjour ! 👋\n\nMerci pour votre intérêt suite à notre campagne *"Tu cherches position ?"*.\n\nInscrivez-vous *gratuitement* sur Wikya, notre plateforme qui vous met en relation avec des recruteurs VTC — entreprises et particuliers — pour que vous puissiez proposer vos services et consulter leurs offres :\n\n👉 ${FRONTEND_URL}/inscription-conducteur\n\nC'est rapide (2 minutes) ! N'hésitez pas si vous avez des questions.\n\nL'équipe Wikya`;

  const [copiedCampagne, setCopiedCampagne] = useState(false);
  const copyCampagne = () => {
    navigator.clipboard.writeText(messageCampagne);
    setCopiedCampagne(true);
    setTimeout(() => setCopiedCampagne(false), 2000);
  };

  // Nouvelle campagne conducteurs (Wikya live)
  const messageNouvelleCampagne = `Tu cherches une position ? 🚗\n\nInscris-toi gratuitement sur Wikya qui est la première plateforme qui te met en relation avec des recruteurs VTC en Côte d'Ivoire — entreprises et particuliers.\n\n✅ Inscription gratuite\n✅ Profil visible par tous les recruteurs\n✅ Consulte les offres disponibles\n\nRejoins Wikya maintenant :\n👉 ${FRONTEND_URL}/inscription-conducteur\n\nL'équipe Wikya`;

  const [copiedNouvelleCampagne, setCopiedNouvelleCampagne] = useState(false);
  const copyNouvelleCampagne = () => {
    navigator.clipboard.writeText(messageNouvelleCampagne);
    setCopiedNouvelleCampagne(true);
    setTimeout(() => setCopiedNouvelleCampagne(false), 2000);
  };

  // Message prospection recruteurs
  const messageRecruteur = `Du mal à trouver un conducteur ? 🚗\n\nWikya est la première plateforme de mise en relation entre recruteurs et conducteurs VTC en Côte d'Ivoire.\n\nPubliez votre offre en quelques minutes et recevez des candidatures directement sur WhatsApp.\n\n👉 ${FRONTEND_URL}/inscription-recruteur\n\nL'équipe Wikya`;

  const [copiedRecruteur, setCopiedRecruteur] = useState(false);
  const copyRecruteur = () => {
    navigator.clipboard.writeText(messageRecruteur);
    setCopiedRecruteur(true);
    setTimeout(() => setCopiedRecruteur(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* ── Bouton campagne "Tu cherches position ?" ── */}
      <div className="bg-wikya-blue/5 border-2 border-wikya-blue/20 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">📣</span>
          <div>
            <h3 className="font-bold text-wikya-blue">Campagne "Tu cherches position ?"</h3>
            <p className="text-sm text-gray-500 mt-0.5">Pour les personnes qui ont répondu à la campagne mais ne se sont pas encore pré-inscrites.</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed">
          {messageCampagne}
        </div>
        <button
          onClick={copyCampagne}
          className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${copiedCampagne ? 'bg-green-100 text-green-700' : 'bg-wikya-blue text-white hover:bg-blue-800'}`}
        >
          {copiedCampagne ? '✅ Message copié !' : '📋 Copier ce message'}
        </button>
        <p className="text-xs text-gray-400 mt-2">Collez ce message dans n'importe quelle conversation WhatsApp.</p>
      </div>

      {/* ── Nouvelle campagne conducteurs (Wikya live) ── */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🚀</span>
          <div>
            <h3 className="font-bold text-purple-700">Nouvelle campagne — Wikya est live !</h3>
            <p className="text-sm text-gray-500 mt-0.5">Pour de nouveaux conducteurs VTC qui ne connaissent pas encore Wikya.</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed">
          {messageNouvelleCampagne}
        </div>
        <button
          onClick={copyNouvelleCampagne}
          className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${copiedNouvelleCampagne ? 'bg-green-100 text-green-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
        >
          {copiedNouvelleCampagne ? '✅ Message copié !' : '📋 Copier ce message'}
        </button>
        <p className="text-xs text-gray-400 mt-2">Collez ce message dans n'importe quelle conversation WhatsApp.</p>
      </div>

      {/* ── Message prospection recruteurs ── */}
      <div className="bg-wikya-orange/5 border-2 border-wikya-orange/20 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🏢</span>
          <div>
            <h3 className="font-bold text-wikya-orange">Prospection recruteurs</h3>
            <p className="text-sm text-gray-500 mt-0.5">Pour les recruteurs qui ont du mal à trouver un conducteur et ne sont pas encore inscrits.</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed">
          {messageRecruteur}
        </div>
        <button
          onClick={copyRecruteur}
          className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${copiedRecruteur ? 'bg-green-100 text-green-700' : 'bg-wikya-orange text-white hover:bg-orange-600'}`}
        >
          {copiedRecruteur ? '✅ Message copié !' : '📋 Copier ce message'}
        </button>
        <p className="text-xs text-gray-400 mt-2">Collez ce message dans n'importe quelle conversation WhatsApp.</p>
      </div>

      {/* ── Message de finalisation ── */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="font-bold text-green-700">Message d'invitation à finaliser</h3>
            <p className="text-sm text-gray-500 mt-0.5">Envoyé aux conducteurs pré-inscrits qui n'ont pas encore finalisé leur profil.</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed">
          {`Bonjour [Prénom] 👋\n\nSuite à votre inscription lors de notre campagne *"Tu cherches position ? Inscris-toi ici"*, nous revenons vers vous comme promis.\n\nNous avons mis en place *Wikya*, une plateforme qui vous met en relation avec des recruteurs VTC — entreprises et particuliers — pour que vous puissiez proposer vos services et consulter leurs offres.\n\nBienvenue sur Wikya ! 🎉\nFinalisez votre inscription ici :\n👉 [lien personnalisé]`}
        </div>
        <p className="text-xs text-gray-400 mt-2">Le prénom et le lien sont automatiquement personnalisés pour chaque conducteur.</p>
      </div>

      {/* ── Séparateur ── */}
      <div className="border-t pt-2">
        <h3 className="font-semibold text-gray-700 mb-3">Conducteurs pré-inscrits à contacter</h3>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
        <p className="font-medium mb-1">Comment utiliser cette liste ?</p>
        <p>Cliquez sur <strong>WhatsApp</strong> pour ouvrir une conversation avec le conducteur. Le message d'invitation est pré-rempli — il vous suffit d'envoyer.</p>
      </div>

      {/* ── Recherche et filtres ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, prénom ou email..."
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-wikya-blue"
        />
        <select
          value={filtreTel}
          onChange={e => setFiltreTel(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Tous</option>
          <option value="avec">Avec téléphone</option>
          <option value="sans">Sans téléphone</option>
        </select>
        {(search || filtreTel) && (
          <button onClick={() => { setSearch(''); setFiltreTel(''); }} className="text-sm text-wikya-orange hover:underline">
            Réinitialiser
          </button>
        )}
      </div>

      {(() => {
        const dataFiltree = data.filter(d => {
          const q = search.toLowerCase();
          if (q && !`${d.prenom} ${d.nom} ${d.email}`.toLowerCase().includes(q)) return false;
          if (filtreTel === 'avec' && !d.telephone) return false;
          if (filtreTel === 'sans' && d.telephone) return false;
          return true;
        });

        return (
          <>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                {dataFiltree.length} conducteur(s)
                {(search || filtreTel) && <span className="text-gray-400"> sur {data.length} total</span>}
              </p>
              <div className="flex gap-2">
                <button onClick={load} className="btn btn-outline">🔄 Actualiser</button>
                {dataFiltree.length > 0 && <button onClick={exportCSV} className="btn btn-primary">⬇️ Exporter CSV</button>}
              </div>
            </div>

            {loading ? <p className="text-gray-400">Chargement...</p> : data.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">✅</p>
                <p>Tous les conducteurs ont finalisé leur inscription.</p>
              </div>
            ) : dataFiltree.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-2xl mb-3">🔍</p>
                <p>Aucun résultat pour cette recherche.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3">Conducteur</th>
                      <th className="text-left p-3">Téléphone</th>
                      <th className="text-left p-3">Lien de finalisation</th>
                      <th className="text-left p-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFiltree.map((d, i) => {
                const link = waLink(d.telephone, d.message);
                return (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium">{d.prenom} {d.nom}</p>
                      <p className="text-xs text-gray-400">{d.email}</p>
                    </td>

                    {/* Téléphone — éditable en ligne */}
                    <td className="p-3">
                      {editingId === d.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            value={editTel}
                            onChange={e => setEditTel(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveTelephone(d.id); if (e.key === 'Escape') cancelEdit(); }}
                            placeholder="+22507XXXXXXXX"
                            className="border border-wikya-blue rounded px-2 py-1 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-wikya-blue"
                            autoFocus
                          />
                          <button onClick={() => saveTelephone(d.id)} disabled={savingTel}
                            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
                            {savingTel ? '…' : '✓'}
                          </button>
                          <button onClick={cancelEdit}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 group">
                          <span className={`text-sm ${d.telephone ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                            {d.telephone || 'Aucun numéro'}
                          </span>
                          <button onClick={() => startEdit(d)}
                            className="opacity-0 group-hover:opacity-100 text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-wikya-blue/10 hover:text-wikya-blue transition-all"
                            title="Modifier le numéro">
                            ✏️
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <a href={d.lien} target="_blank" rel="noopener noreferrer"
                        className="text-wikya-blue hover:underline text-xs break-all">
                        {d.lien}
                      </a>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 items-center">
                        {link ? (
                          <a href={link} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp
                          </a>
                        ) : (
                          <button onClick={() => startEdit(d)}
                            className="text-xs px-3 py-1.5 bg-orange-100 text-wikya-orange rounded-lg hover:bg-orange-200 font-medium">
                            ✏️ Ajouter un numéro
                          </button>
                        )}
                        <button onClick={() => copyMessage(i, d.message)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                          {copied === i ? '✅' : '📋'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

// ── IMPORT CSV ───────────────────────────────────────────────
function TabImport({ token }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    return lines.slice(1, 6).map(line => {
      const vals = line.split(',').map(v => v.replace(/"/g, '').trim());
      return headers.reduce((obj, h, i) => ({ ...obj, [h]: vals[i] || '' }), {});
    });
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(parseCSV(ev.target.result));
    reader.readAsText(f, 'utf-8');
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setResult(null);
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const conducteurs = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.replace(/"/g, '').trim());
      const row = headers.reduce((obj, h, i) => ({ ...obj, [h]: vals[i] || '' }), {});
      return {
        nom: row['NOM'] || row['Nom'] || '',
        prenom: row['Prénoms'] || row['Prenoms'] || '',
        email: (row['Email Address'] || row['Email'] || '').toLowerCase(),
        telephone: row['Contact'] || '',
        commune: row['Lieu de résidence'] || '',
        ville: row['Lieu de résidence'] || ''
      };
    }).filter(c => c.email && c.nom);

    const res = await fetch(`${API_URL}/api/admin/conducteurs/import`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ conducteurs })
    });
    const data = await res.json();
    setResult(data);
    setImporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        Importez un fichier CSV exporté depuis Google Sheets. Les doublons (même email) seront ignorés automatiquement.
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Sélectionner le fichier CSV</label>
        <input type="file" accept=".csv" onChange={handleFile} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-wikya-blue file:text-white hover:file:bg-blue-800" />
      </div>
      {preview.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Aperçu (5 premières lignes) :</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border">
              <thead className="bg-gray-50">
                <tr>{Object.keys(preview[0]).slice(0, 6).map(k => <th key={k} className="p-2 text-left border-r">{k}</th>)}</tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t">
                    {Object.values(row).slice(0, 6).map((v, j) => <td key={j} className="p-2 border-r truncate max-w-[120px]">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleImport} disabled={importing} className="mt-4 btn btn-primary disabled:opacity-60">
            {importing ? 'Import en cours...' : '🚀 Lancer l\'import'}
          </button>
        </div>
      )}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-green-700 mb-2">Résultat de l'import</h3>
          <p className="text-sm">✅ Succès : <strong>{result.succes}</strong></p>
          <p className="text-sm">🔁 Doublons ignorés : <strong>{result.doublons}</strong></p>
          <p className="text-sm">❌ Erreurs : <strong>{result.erreurs?.length || 0}</strong></p>
        </div>
      )}
    </div>
  );
}

// ── PUBLICITÉS / CAMPAGNES ────────────────────────────────────
function TabAnnonces({ token }) {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  // Formulaire nouvelle campagne
  const [showNewCampagne, setShowNewCampagne] = useState(false);
  const [campagneForm, setCampagneForm] = useState({ nom: '', annonceur: '', actif: true, date_debut: '', date_fin: '' });
  const [savingCampagne, setSavingCampagne] = useState(false);

  // Formulaire nouveau visuel
  const [showNewVisuel, setShowNewVisuel] = useState(null); // campagne_id ou null
  const [visuelForm, setVisuelForm] = useState({ image_url: '', lien_url: '', format: 'medium_rectangle', position: 'repertoire-inline' });
  const [uploading, setUploading] = useState(false);
  const [savingVisuel, setSavingVisuel] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/campagnes`, { headers });
    const json = await res.json();
    setCampagnes(Array.isArray(json) ? json : []);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // ── Upload image depuis l'ordi ──
  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/api/upload/image`, { method: 'POST', headers, body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur upload');
      setVisuelForm(f => ({ ...f, image_url: json.url }));
    } catch (err) {
      alert('Erreur upload : ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── Créer une campagne ──
  const handleCreateCampagne = async (e) => {
    e.preventDefault();
    setSavingCampagne(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/campagnes`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campagneForm, date_debut: campagneForm.date_debut || null, date_fin: campagneForm.date_fin || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setShowNewCampagne(false);
      setCampagneForm({ nom: '', annonceur: '', actif: true, date_debut: '', date_fin: '' });
      setExpanded(ex => ({ ...ex, [json.id]: true }));
      load();
    } catch (err) {
      alert('Erreur : ' + err.message);
    } finally {
      setSavingCampagne(false);
    }
  };

  // ── Toggle actif campagne ──
  const toggleCampagne = async (c) => {
    await fetch(`${API_URL}/api/admin/campagnes/${c.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ actif: !c.actif }),
    });
    load();
  };

  // ── Supprimer campagne ──
  const deleteCampagne = async (id) => {
    if (!confirm('Supprimer cette campagne et tous ses visuels ?')) return;
    await fetch(`${API_URL}/api/admin/campagnes/${id}`, { method: 'DELETE', headers });
    load();
  };

  // ── Ajouter un visuel ──
  const handleAddVisuel = async (e) => {
    e.preventDefault();
    setSavingVisuel(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/campagnes/${showNewVisuel}/annonces`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(visuelForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setShowNewVisuel(null);
      setVisuelForm({ image_url: '', lien_url: '', format: 'medium_rectangle', position: 'repertoire-inline' });
      load();
    } catch (err) {
      alert('Erreur : ' + err.message);
    } finally {
      setSavingVisuel(false);
    }
  };

  // ── Supprimer un visuel ──
  const deleteVisuel = async (campagneId, annonceId) => {
    if (!confirm('Supprimer ce visuel ?')) return;
    await fetch(`${API_URL}/api/admin/campagnes/${campagneId}/annonces/${annonceId}`, { method: 'DELETE', headers });
    load();
  };

  // ── Réinitialiser stats d'un visuel ──
  const resetStats = async (id) => {
    if (!confirm('Réinitialiser les stats de ce visuel ?')) return;
    await fetch(`${API_URL}/api/admin/annonces/${id}/reset-stats`, { method: 'PATCH', headers });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{campagnes.length} campagne(s)</p>
        <button onClick={() => setShowNewCampagne(!showNewCampagne)} className="btn btn-primary text-sm">
          {showNewCampagne ? 'Annuler' : '+ Nouvelle campagne'}
        </button>
      </div>

      {/* ── Formulaire nouvelle campagne ── */}
      {showNewCampagne && (
        <form onSubmit={handleCreateCampagne} className="bg-gray-50 border rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-wikya-blue">Nouvelle campagne</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de la campagne *</label>
              <input required value={campagneForm.nom} onChange={e => setCampagneForm({ ...campagneForm, nom: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm" placeholder="Ex: ATL Cars Janvier 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annonceur *</label>
              <input required value={campagneForm.annonceur} onChange={e => setCampagneForm({ ...campagneForm, annonceur: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm" placeholder="Ex: ATL Cars" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de début</label>
              <input type="date" value={campagneForm.date_debut} onChange={e => setCampagneForm({ ...campagneForm, date_debut: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de fin</label>
              <input type="date" value={campagneForm.date_fin} onChange={e => setCampagneForm({ ...campagneForm, date_fin: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="campagne-actif" checked={campagneForm.actif} onChange={e => setCampagneForm({ ...campagneForm, actif: e.target.checked })} className="w-4 h-4" />
              <label htmlFor="campagne-actif" className="text-sm font-medium">Activer immédiatement</label>
            </div>
          </div>
          <button type="submit" disabled={savingCampagne} className="btn btn-primary disabled:opacity-60">
            {savingCampagne ? 'Création...' : 'Créer la campagne'}
          </button>
        </form>
      )}

      {/* ── Liste des campagnes ── */}
      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="space-y-4">
          {campagnes.map(c => (
            <div key={c.id} className="bg-white border rounded-lg overflow-hidden">
              {/* En-tête campagne */}
              <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(ex => ({ ...ex, [c.id]: !ex[c.id] }))}>
                <span className="text-gray-400 text-sm">{expanded[c.id] ? '▼' : '▶'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.nom}</p>
                  <p className="text-xs text-gray-500">
                    {c.annonceur} · {(c.annonces || []).length} visuel(s)
                    {(c.date_debut || c.date_fin) && ` · ${c.date_debut ? `du ${new Date(c.date_debut).toLocaleDateString('fr-FR')}` : ''} ${c.date_fin ? `au ${new Date(c.date_fin).toLocaleDateString('fr-FR')}` : ''}`}
                  </p>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => toggleCampagne(c)}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${c.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.actif ? '✅ Actif' : '⏸ Inactif'}
                  </button>
                  <button onClick={() => deleteCampagne(c.id)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Visuels de la campagne */}
              {expanded[c.id] && (
                <div className="border-t bg-gray-50 p-4 space-y-3">
                  {(c.annonces || []).map(a => (
                    <div key={a.id} className="bg-white border rounded-lg p-3 flex items-center gap-3 flex-wrap">
                      <img src={a.image_url} alt="" className="w-20 h-12 object-cover rounded border shrink-0"
                        onError={e => { e.target.style.display = 'none'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">
                          {FORMATS.find(f => f.value === a.format)?.label} · {POSITIONS.find(p => p.value === a.position)?.label}
                        </p>
                        {a.lien_url && <p className="text-xs text-wikya-blue truncate">{a.lien_url}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-gray-100 rounded px-2 py-0.5 text-xs">👁 {(a.nb_impressions || 0).toLocaleString('fr-FR')}</span>
                        <span className="bg-gray-100 rounded px-2 py-0.5 text-xs">🖱 {(a.nb_clics || 0).toLocaleString('fr-FR')}</span>
                        {a.nb_impressions > 0 && (
                          <span className="bg-blue-50 text-wikya-blue rounded px-2 py-0.5 text-xs font-medium">
                            CTR {((a.nb_clics || 0) / a.nb_impressions * 100).toFixed(1)}%
                          </span>
                        )}
                        <button onClick={() => resetStats(a.id)} className="text-xs px-2 py-1 bg-gray-50 text-gray-500 rounded hover:bg-gray-100">Réinit.</button>
                        <button onClick={() => deleteVisuel(c.id, a.id)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Supprimer</button>
                      </div>
                    </div>
                  ))}

                  {/* Bouton ajouter visuel */}
                  {showNewVisuel === c.id ? (
                    <form onSubmit={handleAddVisuel} className="bg-white border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-sm text-wikya-blue">Nouveau visuel</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Image *</label>
                          <div className="space-y-2">
                            <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded px-3 py-2 text-sm cursor-pointer hover:border-wikya-blue transition-colors ${uploading ? 'opacity-50' : ''}`}>
                              <input type="file" accept="image/*" className="hidden" disabled={uploading}
                                onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
                              {uploading ? '⏳ Upload...' : '📁 Choisir un fichier'}
                            </label>
                            <p className="text-xs text-gray-400">JPG ou PNG · Max 5 Mo · Ratio recommandé : 4:1 (ex : 800×200 px)</p>
                            {visuelForm.image_url && (
                              <div className="flex items-center gap-2">
                                <img src={visuelForm.image_url} alt="" className="w-16 h-10 object-cover rounded border" />
                                <span className="text-xs text-green-600">✅ Image uploadée</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">URL de destination</label>
                          <input value={visuelForm.lien_url} onChange={e => setVisuelForm({ ...visuelForm, lien_url: e.target.value })}
                            className="w-full border rounded px-3 py-2 text-sm" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Format *</label>
                          <select required value={visuelForm.format} onChange={e => setVisuelForm({ ...visuelForm, format: e.target.value })}
                            className="w-full border rounded px-3 py-2 text-sm">
                            {FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Position *</label>
                          <select required value={visuelForm.position} onChange={e => setVisuelForm({ ...visuelForm, position: e.target.value })}
                            className="w-full border rounded px-3 py-2 text-sm">
                            {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" disabled={savingVisuel || !visuelForm.image_url} className="btn btn-primary text-sm disabled:opacity-60">
                          {savingVisuel ? 'Ajout...' : 'Ajouter le visuel'}
                        </button>
                        <button type="button" onClick={() => { setShowNewVisuel(null); setVisuelForm({ image_url: '', lien_url: '', format: 'medium_rectangle', position: 'repertoire-inline' }); }}
                          className="text-sm px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setShowNewVisuel(c.id)}
                      className="w-full text-sm text-wikya-blue border-2 border-dashed border-wikya-blue/30 rounded-lg py-2 hover:bg-wikya-blue/5 transition-colors">
                      + Ajouter un visuel
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {campagnes.length === 0 && <p className="text-gray-400 text-center py-10">Aucune campagne configurée.</p>}
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD PRINCIPAL ──────────────────────────────────────
export default function DashboardAdmin() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && user.user_metadata?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchNotifications = useCallback(async (tok) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${tok}` }
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (session) fetchNotifications(session.access_token);
  }, [session, fetchNotifications]);

  if (!session) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  const token = session.access_token;
  const unreadCount = notifications.filter(n => !n.lu).length;

  const markNotifRead = async (id) => {
    await fetch(`${API_URL}/api/admin/notifications/${id}/lu`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const markAllRead = async () => {
    await fetch(`${API_URL}/api/admin/notifications/tout-lire`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-wikya-blue text-white py-6 px-8">
        <h1 className="text-2xl font-bold">Dashboard Administrateur</h1>
        <p className="text-blue-200 text-sm mt-1">Wikya VTC — ATL Cars</p>
      </div>

      <div className="container-custom py-8">
        {/* Onglets */}
        <div className="flex gap-2 flex-wrap mb-8 border-b pb-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-wikya-orange text-wikya-orange bg-white'
                  : 'border-transparent text-gray-500 hover:text-wikya-blue'
              }`}
            >
              {tab.label}
              {tab.id === 'stats' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'stats' && (
            <TabStats
              token={token}
              notifications={notifications}
              unreadCount={unreadCount}
              markNotifRead={markNotifRead}
              markAllRead={markAllRead}
            />
          )}
          {activeTab === 'conducteurs' && <TabConducteurs token={token} />}
          {activeTab === 'recruteurs' && <TabRecruteurs token={token} />}
          {activeTab === 'avis' && <TabAvis token={token} />}
          {activeTab === 'whatsapp' && <TabWhatsapp token={token} />}
          {activeTab === 'import' && <TabImport token={token} />}
          {activeTab === 'annonces' && <TabAnnonces token={token} />}
        </div>
      </div>
    </div>
  );
}
