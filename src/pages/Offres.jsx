import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import AdBanner from '../components/AdBanner';

import API_URL from '../lib/api.js';

const TYPES_VEHICULES = ['Moto', 'Tricycle', 'Camionette', 'Véhicule standard', 'Véhicule électrique', 'Véhicule business'];
const TYPES_CONTRAT = ['Location simple (VTC uniquement)', 'Achat progressif (véhicule au conducteur après X ans)', 'Les deux propositions'];

function CarteOffre({ offre, canMessage, session }) {
  const nom = offre.nom_entreprise ||
    [offre.prenom_responsable, offre.nom_responsable].filter(Boolean).join(' ') ||
    (offre.type_recruteur === 'entreprise' ? 'Entreprise' : 'Particulier');

  const totalVehicules = (offre.vehicules || []).reduce((s, v) => s + (parseInt(v.nombre) || 0), 0);

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    setErrMsg('');
    try {
      const res = await fetch(`${API_URL}/api/offres/${offre.id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur envoi');
      }
      setSent(true);
      setMessage('');
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-wikya-blue">{nom}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${offre.type_recruteur === 'entreprise' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-wikya-orange'}`}>
            {offre.type_recruteur === 'entreprise' ? '🏢 Entreprise' : '👤 Particulier'}
          </span>
        </div>
        {totalVehicules > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-wikya-blue">{totalVehicules}</div>
            <div className="text-xs text-gray-500">véhicule{totalVehicules > 1 ? 's' : ''}</div>
          </div>
        )}
      </div>

      {/* Tableau véhicules */}
      {offre.vehicules?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-1.5 font-medium text-gray-500 text-xs">Type</th>
                <th className="text-left px-3 py-1.5 font-medium text-gray-500 text-xs">Nb</th>
                <th className="text-left px-3 py-1.5 font-medium text-gray-500 text-xs">Recette/jour</th>
              </tr>
            </thead>
            <tbody>
              {offre.vehicules.map((v, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-1.5">{v.type}</td>
                  <td className="px-3 py-1.5">{v.nombre}</td>
                  <td className="px-3 py-1.5 font-semibold text-wikya-blue">
                    {Number(v.recette).toLocaleString('fr-FR')} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Détails — visibles uniquement si conducteur abonné */}
      {canMessage && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {offre.heures_travail && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <span>🕐</span> {offre.heures_travail}
            </div>
          )}
          {offre.jours_travail?.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <span>📅</span> {offre.jours_travail.length === 7 ? 'Tous les jours' : offre.jours_travail.join(', ')}
            </div>
          )}
          {offre.garde_vehicule && (
            <div className="flex items-center gap-1.5 text-gray-600 col-span-2">
              <span>🚗</span> {offre.garde_vehicule}
            </div>
          )}
          {offre.type_contrat && (
            <div className="flex items-center gap-1.5 text-gray-600 col-span-2">
              <span>📄</span> {offre.type_contrat}
            </div>
          )}
        </div>
      )}

      {/* Zone contact */}
      <div className="pt-2 border-t">
        {canMessage ? (
          sent ? (
            <div className="bg-green-50 text-green-700 rounded-lg px-4 py-3 text-sm font-medium">
              ✅ Message envoyé au recruteur sur WhatsApp !
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Bonjour, je suis intéressé par votre offre..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-wikya-blue"
                rows={3}
              />
              {errMsg && <p className="text-red-500 text-xs">{errMsg}</p>}
              <button
                onClick={handleMessage}
                disabled={sending || !message.trim()}
                className="btn btn-primary text-sm disabled:opacity-60"
              >
                {sending ? 'Envoi...' : '📩 Envoyer un message au recruteur'}
              </button>
            </div>
          )
        ) : (
          <Link to="/paiement?role=conducteur" className="flex items-center justify-between bg-wikya-blue/5 hover:bg-wikya-blue/10 rounded-lg px-4 py-3 transition-colors">
            <div>
              <p className="text-sm font-semibold text-wikya-blue">🔒 Contacter ce recruteur</p>
              <p className="text-xs text-gray-500 mt-0.5">Abonnez-vous pour envoyer un message — 1 000 FCFA / 2 mois</p>
            </div>
            <span className="text-wikya-orange font-semibold text-sm shrink-0">S'abonner →</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Offres() {
  const { user, session } = useAuth();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreVehicule, setFiltreVehicule] = useState('');
  const [filtreContrat, setFiltreContrat] = useState('');
  const [abonnementActif, setAbonnementActif] = useState(false);

  const isConducteur = user?.user_metadata?.role === 'conducteur';
  const isRecruteur = user?.user_metadata?.role === 'recruteur';
  const isAdmin = user?.user_metadata?.role === 'admin';
  const canMessage = isAdmin || abonnementActif;

  // Vérifier l'abonnement du conducteur
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
    const fetchOffres = async () => {
      try {
        const headers = {};
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

        if (isRecruteur) {
          // Un recruteur voit uniquement ses propres offres
          const res = await fetch(`${API_URL}/api/offres/me`, { headers });
          if (!res.ok) throw new Error('Erreur chargement');
          const data = await res.json();
          setOffres(Array.isArray(data) ? data : []);
        } else {
          // Conducteurs, admin et visiteurs voient toutes les offres
          const res = await fetch(`${API_URL}/api/offres`, { headers });
          if (!res.ok) throw new Error('Erreur chargement');
          const data = await res.json();
          setOffres(data);
        }
      } catch {
        // Echec silencieux : la liste reste vide
      } finally {
        setLoading(false);
      }
    };
    if (session !== undefined) fetchOffres();
  }, [session, isRecruteur]);

  const offresFiltrees = isRecruteur
    ? offres.filter(o => o.vehicules?.length)
    : offres.filter(o => {
        if (!o.vehicules?.length) return false;
        if (filtreVehicule && !o.vehicules.some(v => v.type === filtreVehicule)) return false;
        if (filtreContrat && o.type_contrat !== filtreContrat) return false;
        return true;
      });

  if (isRecruteur) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-wikya-blue mb-1">Mes offres</h1>
              <p className="text-gray-600">Aperçu de vos offres telles que les conducteurs les voient.</p>
            </div>
            <a href="/dashboard-recruteur" className="btn btn-primary text-sm">+ Gérer mes offres</a>
          </div>
          {loading ? (
            <div className="text-center py-20 text-gray-500">Chargement...</div>
          ) : offresFiltrees.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4">💼</p>
              <p className="mb-4">Vous n'avez pas encore créé d'offre.</p>
              <a href="/dashboard-recruteur" className="btn btn-primary">Créer une offre</a>
            </div>
          ) : (
            <div className="space-y-6">
              {offresFiltrees.map(o => (
                <CarteOffre key={o.id} offre={o} canMessage={true} session={session} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Offres de recrutement VTC - Wikya Côte d'Ivoire</title>
        <meta name="description" content="Consultez les offres de recrutement de conducteurs VTC en Côte d'Ivoire. Trouvez le meilleur recruteur et décrochez un emploi VTC à Abidjan." />
      </Helmet>
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wikya-blue mb-2">Offres des recruteurs</h1>
          <p className="text-gray-600">Trouvez un recruteur qui correspond à votre profil.</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type de véhicule</label>
            <select
              value={filtreVehicule}
              onChange={e => setFiltreVehicule(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Tous</option>
              {TYPES_VEHICULES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type de contrat</label>
            <select
              value={filtreContrat}
              onChange={e => setFiltreContrat(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Tous</option>
              {TYPES_CONTRAT.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {(filtreVehicule || filtreContrat) && (
            <button onClick={() => { setFiltreVehicule(''); setFiltreContrat(''); }} className="text-sm text-wikya-orange hover:underline">
              Réinitialiser
            </button>
          )}
          <div className="ml-auto text-sm text-gray-500">
            {offresFiltrees.length} offre{offresFiltrees.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Bannière publicitaire */}
        <AdBanner position="offres-inline" className="mb-4" />

        {/* CTA visiteur non connecté */}
        {!user && (
          <div className="bg-wikya-blue text-white rounded-xl p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
            <p className="font-medium">Connectez-vous pour contacter les recruteurs directement.</p>
            <Link to="/connexion" className="btn bg-white text-wikya-blue hover:bg-gray-100 text-sm">Se connecter</Link>
          </div>
        )}

        {/* CTA conducteur non abonné */}
        {isConducteur && !abonnementActif && (
          <div className="bg-wikya-orange/10 border border-wikya-orange/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-wikya-blue">🔒 Abonnez-vous pour contacter les recruteurs</p>
              <p className="text-sm text-gray-600 mt-0.5">Envoyez des messages directement aux recruteurs — 1 000 FCFA pour 2 mois.</p>
            </div>
            <Link to="/paiement?role=conducteur" className="btn bg-wikya-orange text-white hover:bg-wikya-orange-dark text-sm shrink-0">
              S'abonner maintenant
            </Link>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Chargement...</div>
        ) : offresFiltrees.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Aucune offre ne correspond à vos critères.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offresFiltrees.map(o => (
              <CarteOffre key={o.id} offre={o} canMessage={canMessage} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
