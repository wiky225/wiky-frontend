import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import AdBanner from '../components/AdBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── STATS DYNAMIQUES ──────────────────────────────────────────
function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(() => {});
  }, []);

  const items = [
    { number: stats ? `${stats.conducteurs}+` : '—', label: 'Conducteurs inscrits' },
    { number: stats ? `${stats.recruteurs}+` : '—', label: 'Recruteurs actifs' },
    { number: '4', label: 'Plateformes VTC couvertes' },
    { number: '24/7', label: 'Assistance WhatsApp' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="text-center p-6 bg-wikya-gray-light rounded-xl hover:-translate-y-1 transition-transform">
              <div className="text-4xl font-bold text-wikya-blue mb-2">{item.number}</div>
              <div className="text-sm text-wikya-gray">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── COMMENT ÇA MARCHE ─────────────────────────────────────────
function CommentCaMarche() {
  const stepsRecruteur = [
    'Créez votre compte recruteur',
    'Parcourez les profils et filtrez par ville, expérience, plateforme',
    'Consultez les avis et notations des conducteurs',
    'Contactez directement via WhatsApp',
  ];
  const stepsConducteur = [
    'Inscrivez-vous gratuitement',
    'Complétez votre profil avec permis et expérience',
    'Soyez visible auprès de tous les recruteurs',
    'Recevez des propositions de recrutement',
  ];

  return (
    <section className="py-16 bg-wikya-gray-light">
      <div className="container-custom">
        <h2 className="section-title">Comment ça marche ?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recruteur */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🏢</span>
              <h3 className="text-xl font-bold text-wikya-blue">Je suis recruteur</h3>
            </div>
            <div className="space-y-4">
              {stepsRecruteur.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-wikya-blue text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600 pt-1">{step}</p>
                </div>
              ))}
            </div>
            <Link to="/inscription-recruteur" className="btn btn-primary w-full text-center mt-8 block">
              Commencer à recruter →
            </Link>
          </div>

          {/* Conducteur */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🚗</span>
              <h3 className="text-xl font-bold text-wikya-blue">Je suis conducteur</h3>
            </div>
            <div className="space-y-4">
              {stepsConducteur.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-wikya-orange text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600 pt-1">{step}</p>
                </div>
              ))}
            </div>
            <Link to="/inscription-conducteur" className="btn btn-secondary w-full text-center mt-8 block">
              M'inscrire gratuitement →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SLIDER CONDUCTEURS ────────────────────────────────────────
function SliderConducteurs() {
  const [conducteurs, setConducteurs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  useEffect(() => {
    fetch(`${API_URL}/api/conducteurs?limit=8`)
      .then(r => r.ok ? r.json() : {})
      .then(data => setConducteurs(data.data || data || []))
      .catch(() => {});
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  if (conducteurs.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-wikya-blue">Conducteurs disponibles</h2>
          <Link to="/repertoire" className="text-wikya-orange hover:underline text-sm font-medium">
            Voir tous →
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {conducteurs.map(c => {
                const plateformes = c.plateformes_vtc
                  ? c.plateformes_vtc.split(/[,;/]/).map(p => p.trim()).filter(Boolean)
                  : [];
                return (
                  <Link
                    key={c.id}
                    to={`/conducteur/${c.id}`}
                    className="flex-none w-[78vw] sm:w-64 md:w-72 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={c.photo_url || `https://ui-avatars.com/api/?name=${c.prenom}+${c.nom}&size=300&background=253b56&color=fff`}
                        alt={`${c.prenom} ${c.nom}`}
                        className="w-full h-40 object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Disponible
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-wikya-blue">{c.prenom} {c.nom}</p>
                      {(c.ville || c.commune) && (
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {[c.ville, c.commune].filter(Boolean).join(' — ')}
                        </p>
                      )}
                      {plateformes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {plateformes.slice(0, 2).map(p => (
                            <span key={p} className="text-xs bg-blue-50 text-wikya-blue border border-blue-100 rounded-full px-2 py-0.5">
                              {p}
                            </span>
                          ))}
                          {plateformes.length > 2 && (
                            <span className="text-xs text-gray-400">+{plateformes.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Boutons prev / next (desktop) */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white border rounded-full shadow-md items-center justify-center text-xl hover:bg-gray-50 hidden md:flex"
          >‹</button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white border rounded-full shadow-md items-center justify-center text-xl hover:bg-gray-50 hidden md:flex"
          >›</button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {conducteurs.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === selectedIndex ? 'bg-wikya-blue' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── APERÇU OFFRES ─────────────────────────────────────────────
function ApercuOffres() {
  const [offres, setOffres] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/offres`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setOffres((Array.isArray(data) ? data : []).filter(o => o.vehicules?.length).slice(0, 3)))
      .catch(() => {});
  }, []);

  if (offres.length === 0) return null;

  return (
    <section className="py-16 bg-wikya-gray-light">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-wikya-blue">Offres de recrutement</h2>
          <Link to="/offres" className="text-wikya-orange hover:underline text-sm font-medium">
            Voir toutes →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {offres.map(o => {
            const nom = o.type_recruteur === 'entreprise'
              ? o.nom_entreprise
              : `${o.prenom_responsable} ${o.nom_responsable}`;
            const totalVehicules = (o.vehicules || []).reduce((s, v) => s + (parseInt(v.nombre) || 0), 0);
            return (
              <div key={o.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-bold text-wikya-blue">{nom}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.type_recruteur === 'entreprise' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-wikya-orange'}`}>
                      {o.type_recruteur === 'entreprise' ? '🏢 Entreprise' : '👤 Particulier'}
                    </span>
                  </div>
                  {totalVehicules > 0 && (
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-wikya-blue">{totalVehicules}</div>
                      <div className="text-xs text-gray-500">véhicule{totalVehicules > 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>
                {o.vehicules.slice(0, 2).map((v, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-t">
                    <span className="text-gray-600">{v.type}</span>
                    <span className="font-semibold text-wikya-blue">
                      {Number(v.recette).toLocaleString('fr-FR')} FCFA/j
                    </span>
                  </div>
                ))}
                <Link to="/offres" className="mt-4 text-xs text-wikya-orange font-semibold hover:underline block">
                  Voir le détail →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── FEATURES ──────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '⭐',
    title: 'Avis & Notation',
    description: 'Les recruteurs notent les conducteurs avec étoiles et badges. Identifiez rapidement les meilleurs profils.',
  },
  {
    icon: '💼',
    title: 'Offres de recrutement',
    description: 'Les recruteurs publient leurs conditions : type de véhicule, recette journalière, type de contrat.',
  },
  {
    icon: '❤️',
    title: 'Favoris',
    description: 'Sauvegardez les meilleurs profils et retrouvez-les facilement dans votre espace recruteur.',
  },
  {
    icon: '🔍',
    title: 'Recherche avancée',
    description: 'Filtrez par ville, années d\'expérience et plateforme VTC. Vue grille ou liste au choix.',
  },
];

// ── CTA FINAL ─────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-20 bg-wikya-blue text-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Rejoignez la plateforme</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white/10 rounded-2xl p-8 text-center hover:bg-white/20 transition-colors">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold mb-2">Je recrute</h3>
            <p className="text-blue-200 text-sm mb-6">
              Accédez à des centaines de profils vérifiés. 10 000 FCFA/mois.
            </p>
            <Link to="/inscription-recruteur" className="btn bg-wikya-orange text-white hover:bg-wikya-orange-dark w-full block text-center">
              Créer mon compte recruteur
            </Link>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 text-center hover:bg-white/20 transition-colors">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold mb-2">Je suis conducteur</h3>
            <p className="text-blue-200 text-sm mb-6">
              Inscription gratuite. Soyez visible et trouvez un recruteur.
            </p>
            <Link to="/inscription-conducteur" className="btn bg-white text-wikya-blue hover:bg-gray-100 w-full block text-center">
              M'inscrire gratuitement
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────
export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-wikya text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trouvez votre <span className="text-wikya-orange">Conducteur VTC</span> idéal
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            La première plateforme de mise en relation entre conducteurs professionnels et recruteurs en Côte d'Ivoire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/repertoire" className="btn btn-secondary text-lg px-8 py-4">
              Voir les Conducteurs
            </Link>
            <Link to="/inscription-recruteur" className="btn bg-white text-wikya-blue hover:bg-gray-100 text-lg px-8 py-4">
              Je Recrute
            </Link>
          </div>
        </div>
      </section>

      <StatsSection />
      <AdBanner position="home-leaderboard" className="py-2 bg-white" />
      <CommentCaMarche />
      <SliderConducteurs />
      <ApercuOffres />

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="section-title">Pourquoi choisir la plateforme ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card p-6 hover:-translate-y-2 transition-transform">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-wikya-blue mb-3">{f.title}</h3>
                <p className="text-wikya-gray text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
