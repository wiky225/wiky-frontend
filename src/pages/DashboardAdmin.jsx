import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TABS = [
  { id: 'stats', label: '📊 Vue d\'ensemble' },
  { id: 'conducteurs', label: '🚗 Conducteurs' },
  { id: 'recruteurs', label: '🏢 Recruteurs' },
  { id: 'avis', label: '⭐ Avis' },
  { id: 'whatsapp', label: '📱 WhatsApp' },
  { id: 'import', label: '📥 Import CSV' }
];

function StatCard({ label, value, sub, color = 'blue' }) {
  const colors = { blue: 'border-wiky-blue text-wiky-blue', orange: 'border-wiky-orange text-wiky-orange', green: 'border-green-500 text-green-600', gray: 'border-gray-400 text-gray-500' };
  return (
    <div className={`bg-white rounded-lg shadow p-5 border-l-4 ${colors[color]}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── VUE D'ENSEMBLE ──────────────────────────────────────────
function TabStats({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setStats);
  }, [token]);

  if (!stats) return <p className="text-gray-400">Chargement...</p>;
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-wiky-blue">Conducteurs</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.conducteurs.total} color="blue" />
        <StatCard label="Finalisés" value={stats.conducteurs.finalises} color="green" />
        <StatCard label="Non finalisés" value={stats.conducteurs.non_finalises} color="orange" />
        <StatCard label="Archivés" value={stats.conducteurs.archives} color="gray" />
      </div>
      <h2 className="text-xl font-bold text-wiky-blue">Recruteurs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total" value={stats.recruteurs.total} color="blue" />
        <StatCard label="Abonnés actifs" value={stats.recruteurs.abonnes} color="green" />
        <StatCard label="Avis publiés" value={stats.avis.total} color="orange" />
      </div>
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

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/whatsapp`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    setData(Array.isArray(json) ? json : []);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    const lines = ['Prenom,Nom,Telephone,Email,Lien,Message',
      ...data.map(d => `"${d.prenom}","${d.nom}","${d.telephone || ''}","${d.email}","${d.lien}","${d.message.replace(/"/g, '""')}"`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'whatsapp_finalisation.csv'; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="text-sm text-gray-500">{data.length} conducteur(s) non finalisé(s)</p>
        <div className="flex gap-2">
          <button onClick={load} className="btn btn-outline">🔄 Actualiser</button>
          {data.length > 0 && <button onClick={exportCSV} className="btn btn-primary">⬇️ Exporter CSV</button>}
        </div>
      </div>
      {loading ? <p className="text-gray-400">Chargement...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Nom</th>
                <th className="text-left p-3">Téléphone</th>
                <th className="text-left p-3">Lien de finalisation</th>
                <th className="text-left p-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{d.nom} {d.prenom}</td>
                  <td className="p-3">{d.telephone || '—'}</td>
                  <td className="p-3">
                    <a href={d.lien} target="_blank" rel="noopener noreferrer" className="text-wiky-blue hover:underline text-xs break-all">{d.lien}</a>
                  </td>
                  <td className="p-3">
                    <button onClick={() => navigator.clipboard.writeText(d.message)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
                      📋 Copier
                    </button>
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
        <input type="file" accept=".csv" onChange={handleFile} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-wiky-blue file:text-white hover:file:bg-blue-800" />
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

// ── DASHBOARD PRINCIPAL ──────────────────────────────────────
export default function DashboardAdmin() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (user && user.user_metadata?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!session) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  const token = session.access_token;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-wiky-blue text-white py-6 px-8">
        <h1 className="text-2xl font-bold">Dashboard Administrateur</h1>
        <p className="text-blue-200 text-sm mt-1">Wiky VTC — ATL Cars</p>
      </div>

      <div className="container-custom py-8">
        {/* Onglets */}
        <div className="flex gap-2 flex-wrap mb-8 border-b pb-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-wiky-orange text-wiky-orange bg-white'
                  : 'border-transparent text-gray-500 hover:text-wiky-blue'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'stats' && <TabStats token={token} />}
          {activeTab === 'conducteurs' && <TabConducteurs token={token} />}
          {activeTab === 'recruteurs' && <TabRecruteurs token={token} />}
          {activeTab === 'avis' && <TabAvis token={token} />}
          {activeTab === 'whatsapp' && <TabWhatsapp token={token} />}
          {activeTab === 'import' && <TabImport token={token} />}
        </div>
      </div>
    </div>
  );
}
