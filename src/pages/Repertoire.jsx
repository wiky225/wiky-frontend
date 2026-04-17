import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import AdBanner from '../components/AdBanner';

import API_URL from '../lib/api.js';

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
    .filter(Boolean).join('').toUpperCase();

  return (
    <Link
      to="/connexion"
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
    >
      <div className="relative w-full h-48 bg-gradient-to-br from-wikya-blue/10 to-wikya-blue/20 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-wikya-blue/20 flex items-center justify-center">
          <span className="text-2xl font-bold text-wikya-blue/50">{initiales || '?'}</span>
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Profil masqué
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-wikya-blue">Conducteur VTC</h3>
        {(conducteur.ville || conducteur.commune) && (
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {[conducteur.ville, conducteur.commune].filter(Boolean).join(' — ')}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-3">Connectez-vous pour voir le profil complet</p>
        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
          <span className="text-wikya-orange font-semibold text-sm flex items-center gap-1">
            Se connecter
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
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

  const statutConfig = {
    'Disponible':   { dot: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-50', label: 'Disponible' },
    'En poste':     { dot: 'bg-orange-400', text: 'text-orange-700', bg: 'bg-orange-50', label: 'En poste' },
    'Indisponible': { dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-100', label: 'Indisponible' },
  };
  const statut = statutConfig[conducteur.statut] || statutConfig['Disponible'];

  return (
    <Link
      to={`/conducteur/${conducteur.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all hover:-translate-y-0.5 flex flex-col"
    >
      <div className="relative">
        <img
          src={conducteur.photo_url || `https://ui-avatars.com/api/?name=${conducteur.prenom}+${conducteur.nom}&size=300&background=253b56&color=fff`}
          alt={`${conducteur.prenom} ${conducteur.nom}`}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 right-3 ${statut.bg} ${statut.text} text-xs px-2.5 py-1 rounded-full font-medium shadow-sm flex items-center gap-1.5`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`}></span>
          {statut.label}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-wikya-blue">
          {showFullName ? `${conducteur.prenom} ${conducteur.nom}` : conducteur.prenom}
        </h3>
        <div className="mt-1.5 space-y-1">
          {(conducteur.ville || conducteur.commune) && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {[conducteur.ville, conducteur.commune].filter(Boolean).join(' — ')}
            </p>
          )}
          {conducteur.annees_experience && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {conducteur.annees_experience}
            </p>
          )}
        </div>
        {plateformes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {plateformes.slice(0, 3).map(p => (
              <span key={p} className="text-xs bg-blue-50 text-wikya-blue border border-blue-100 rounded-full px-2 py-0.5 font-medium">
                {p}
              </span>
            ))}
            {plateformes.length > 3 && (
              <span className="text-xs text-gray-400 self-center">+{plateformes.length - 3}</span>
            )}
          </div>
        )}
        {conducteur.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1 leading-relaxed">{conducteur.description}</p>
        )}
        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
          <span className="text-wikya-orange font-semibold text-sm flex items-center gap-1">
            Voir profil
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
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
        <meta property="og:title" content="Répertoire des conducteurs VTC - Wikya" />
        <meta property="og:description" content="Des centaines de profils de conducteurs VTC vérifiés en Côte d'Ivoire. Filtrez par ville, service et expérience." />
        <meta property="og:image" content="https://wikya.ci/assets/wikya-logo-new.png" />
        <meta property="og:url" content="https://wikya.ci/repertoire" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wikya" />
        <meta name="twitter:card" content="summary" />
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
