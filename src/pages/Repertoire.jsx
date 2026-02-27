import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import AdBanner from '../components/AdBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── SKELETON ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

// ── CARTE ANONYME (visiteur non connecté) ────────────────────
function ConducteurCardAnonymous({ conducteur }) {
  const initiales = [conducteur.prenom?.[0], conducteur.nom?.[0]]
    .filter(Boolean).join('. ') + '.';

  return (
    <Link
      to="/connexion"
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
    >
      <div className="relative w-full h-48 bg-wikya-blue/10 flex items-center justify-center">
        <span className="text-4xl font-bold text-wikya-blue/40">{initiales}</span>
        <span className="absolute top-3 right-3 bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
          🔒 Profil masqué
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-wikya-blue">{initiales}</h3>
        {(conducteur.ville || conducteur.commune) && (
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            📍 {[conducteur.ville, conducteur.commune].filter(Boolean).join(' — ')}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-3 italic">
          Connectez-vous pour voir le profil complet
        </p>
        <div className="mt-4 flex justify-end">
          <span className="text-wikya-orange font-semibold text-sm">Se connecter →</span>
        </div>
      </div>
    </Link>
  );
}

// ── CARTE GRILLE ─────────────────────────────────────────────
function ConducteurCardGrid({ conducteur, showFullName }) {
  const plateformes = conducteur.plateformes_vtc
    ? conducteur.plateformes_vtc.split(/[,;/]/).map(p => p.trim()).filter(Boolean)
    : [];

  return (
    <Link
      to={`/conducteur/${conducteur.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
    >
      <div className="relative">
        <img
          src={conducteur.photo_url || `https://ui-avatars.com/api/?name=${conducteur.prenom}+${conducteur.nom}&size=300&background=253b56&color=fff`}
          alt={`${conducteur.prenom} ${conducteur.nom}`}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">
          Disponible
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-wikya-blue">
          {showFullName ? `${conducteur.prenom} ${conducteur.nom}` : conducteur.prenom}
        </h3>
        <div className="mt-1 space-y-1">
          {(conducteur.ville || conducteur.commune) && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              📍 {[conducteur.ville, conducteur.commune].filter(Boolean).join(' — ')}
            </p>
          )}
          {conducteur.annees_experience && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              ⏱️ {conducteur.annees_experience}
            </p>
          )}
        </div>
        {plateformes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {plateformes.slice(0, 3).map(p => (
              <span key={p} className="text-xs bg-blue-50 text-wikya-blue border border-blue-100 rounded-full px-2 py-0.5">
                {p}
              </span>
            ))}
            {plateformes.length > 3 && (
              <span className="text-xs text-gray-400">+{plateformes.length - 3}</span>
            )}
          </div>
        )}
        {conducteur.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-1">{conducteur.description}</p>
        )}
        <div className="mt-4 flex justify-end">
          <span className="text-wikya-orange font-semibold text-sm">Voir profil →</span>
        </div>
      </div>
    </Link>
  );
}

// ── CARTE LISTE ──────────────────────────────────────────────
function ConducteurCardList({ conducteur, showFullName }) {
  const plateformes = conducteur.plateformes_vtc
    ? conducteur.plateformes_vtc.split(/[,;/]/).map(p => p.trim()).filter(Boolean)
    : [];

  return (
    <Link
      to={`/conducteur/${conducteur.id}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition-all flex gap-4 p-4 items-center"
    >
      <img
        src={conducteur.photo_url || `https://ui-avatars.com/api/?name=${conducteur.prenom}+${conducteur.nom}&size=80&background=253b56&color=fff`}
        alt={`${conducteur.prenom} ${conducteur.nom}`}
        className="w-16 h-16 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-wikya-blue">
            {showFullName ? `${conducteur.prenom} ${conducteur.nom}` : conducteur.prenom}
          </h3>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
            Disponible
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 mt-1">
          {(conducteur.ville || conducteur.commune) && (
            <span className="text-xs text-gray-500">📍 {[conducteur.ville, conducteur.commune].filter(Boolean).join(' — ')}</span>
          )}
          {conducteur.annees_experience && (
            <span className="text-xs text-gray-500">⏱️ {conducteur.annees_experience}</span>
          )}
        </div>
        {plateformes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {plateformes.slice(0, 4).map(p => (
              <span key={p} className="text-xs bg-blue-50 text-wikya-blue border border-blue-100 rounded-full px-2 py-0.5">
                {p}
              </span>
            ))}
            {plateformes.length > 4 && (
              <span className="text-xs text-gray-400">+{plateformes.length - 4}</span>
            )}
          </div>
        )}
      </div>
      <span className="text-wikya-orange font-semibold text-sm shrink-0">→</span>
    </Link>
  );
}

// ── PAGE PRINCIPALE ──────────────────────────────────────────
export default function Repertoire() {
  const { user, session } = useAuth();
  const [conducteurs, setConducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [abonnementActif, setAbonnementActif] = useState(false);
  const [recruteurAbonne, setRecruteurAbonne] = useState(null); // null = chargement en cours

  const isConducteur = user?.user_metadata?.role === 'conducteur';
  const isRecruteur = user?.user_metadata?.role === 'recruteur';
  const isAdmin = user?.user_metadata?.role === 'admin';
  // Noms complets : admin toujours, recruteur abonné, conducteur abonné
  const showFullName = isAdmin || (isRecruteur && recruteurAbonne) || abonnementActif;

  useEffect(() => {
    if (!isConducteur || !session?.access_token) return;
    fetch(`${API_URL}/api/paiements/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(d => setAbonnementActif(d.actif === true))
      .catch(() => {});
  }, [isConducteur, session]);

  useEffect(() => {
    if (!isRecruteur || !session?.access_token) return;
    fetch(`${API_URL}/api/abonnements/check`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(d => setRecruteurAbonne(d.active === true))
      .catch(() => setRecruteurAbonne(false));
  }, [isRecruteur, session]);

  const [search, setSearch] = useState('');
  const [filtreVille, setFiltreVille] = useState('');
  const [filtreExperience, setFiltreExperience] = useState('');
  const [filtrePlateforme, setFiltrePlateforme] = useState('');

  useEffect(() => {
    const fetchConducteurs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/conducteurs?limit=100`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        const data = await response.json();
        setConducteurs(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConducteurs();
  }, []);

  // Options des filtres générées depuis les données
  const villes = useMemo(() => {
    const set = new Set();
    conducteurs.forEach(c => {
      if (c.ville) set.add(c.ville);
      if (c.commune) set.add(c.commune);
    });
    return [...set].sort();
  }, [conducteurs]);

  const experiences = useMemo(() => {
    const set = new Set();
    conducteurs.forEach(c => { if (c.annees_experience) set.add(c.annees_experience); });
    return [...set].sort();
  }, [conducteurs]);

  const plateformes = useMemo(() => {
    const set = new Set();
    conducteurs.forEach(c => {
      if (c.plateformes_vtc) {
        c.plateformes_vtc.split(/[,;/]/).forEach(p => { const t = p.trim(); if (t) set.add(t); });
      }
    });
    return [...set].sort();
  }, [conducteurs]);

  // Filtrage
  const conducteursFiltres = useMemo(() => {
    return conducteurs.filter(c => {
      if (search) {
        const q = search.toLowerCase();
        if (!`${c.nom} ${c.prenom}`.toLowerCase().includes(q)) return false;
      }
      if (filtreVille && c.ville !== filtreVille && c.commune !== filtreVille) return false;
      if (filtreExperience && c.annees_experience !== filtreExperience) return false;
      if (filtrePlateforme) {
        const ps = (c.plateformes_vtc || '').toLowerCase();
        if (!ps.includes(filtrePlateforme.toLowerCase())) return false;
      }
      return true;
    });
  }, [conducteurs, search, filtreVille, filtreExperience, filtrePlateforme]);

  const hasFilters = search || filtreVille || filtreExperience || filtrePlateforme;

  const resetFiltres = () => {
    setSearch('');
    setFiltreVille('');
    setFiltreExperience('');
    setFiltrePlateforme('');
  };

  if (error) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-red-600">Erreur : {error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Répertoire des conducteurs VTC - Wikya Côte d'Ivoire</title>
        <meta name="description" content="Parcourez des centaines de profils de conducteurs VTC vérifiés en Côte d'Ivoire. Filtrez par ville, type de service et expérience pour trouver le bon profil." />
      </Helmet>
      <div className="container-custom">

        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-wikya-blue mb-1">Répertoire des Conducteurs VTC</h1>
          <p className="text-gray-500">Trouvez le conducteur qui correspond à vos besoins.</p>
        </div>

        {/* CTA visiteur */}
        {!user && (
          <div className="bg-wikya-blue text-white rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">🔒 Profils partiellement masqués</p>
              <p className="text-sm text-blue-200 mt-0.5">
                Connectez-vous ou créez un compte pour accéder aux profils complets.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/connexion" className="btn bg-white text-wikya-blue hover:bg-gray-100 text-sm py-2">
                Se connecter
              </Link>
              <Link to="/inscription" className="btn bg-wikya-orange text-white hover:bg-wikya-orange-dark text-sm py-2">
                S'inscrire
              </Link>
            </div>
          </div>
        )}

        {/* Bannière paywall recruteur non abonné */}
        {isRecruteur && recruteurAbonne === false && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-orange-800">🔒 Contacts des conducteurs masqués</p>
              <p className="text-sm text-orange-700 mt-0.5">
                Abonnez-vous pour voir les numéros de téléphone, emails et accéder aux profils complets.
              </p>
            </div>
            <a href="/paiement?role=recruteur" className="btn bg-wikya-orange text-white hover:bg-wikya-orange-dark text-sm py-2 shrink-0">
              S'abonner — 10 000 FCFA/mois
            </a>
          </div>
        )}

        {/* Bannière pub */}
        <AdBanner position="repertoire-inline" className="mb-6" />

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher par nom ou prénom..."
            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-wikya-blue"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select value={filtreVille} onChange={e => setFiltreVille(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="">📍 Toutes les villes</option>
              {villes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={filtreExperience} onChange={e => setFiltreExperience(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="">⏱️ Toute expérience</option>
              {experiences.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select value={filtrePlateforme} onChange={e => setFiltrePlateforme(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="">🚕 Toutes les plateformes</option>
              {plateformes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between">
            {hasFilters ? (
              <button onClick={resetFiltres} className="text-sm text-wikya-orange hover:underline">
                Réinitialiser les filtres
              </button>
            ) : <span />}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {loading ? '...' : `${conducteursFiltres.length} conducteur${conducteursFiltres.length > 1 ? 's' : ''}`}
              </span>
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Vue grille"
                  className={`px-3 py-1.5 text-sm transition-colors ${viewMode === 'grid' ? 'bg-wikya-blue text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >⊞</button>
                <button
                  onClick={() => setViewMode('list')}
                  title="Vue liste"
                  className={`px-3 py-1.5 text-sm border-l transition-colors ${viewMode === 'list' ? 'bg-wikya-blue text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >☰</button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : conducteursFiltres.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">Aucun conducteur ne correspond à vos critères.</p>
            {hasFilters && (
              <button onClick={resetFiltres} className="btn btn-outline mt-4">Réinitialiser les filtres</button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conducteursFiltres.map(c => user
              ? <ConducteurCardGrid key={c.id} conducteur={c} showFullName={showFullName} />
              : <ConducteurCardAnonymous key={c.id} conducteur={c} />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {conducteursFiltres.map(c => user
              ? <ConducteurCardList key={c.id} conducteur={c} showFullName={showFullName} />
              : <ConducteurCardAnonymous key={c.id} conducteur={c} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
