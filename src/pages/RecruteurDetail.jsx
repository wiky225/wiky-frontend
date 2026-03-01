import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import API_URL from '../lib/api.js';

export default function RecruteurDetail() {
  const { id } = useParams();
  const { user, session } = useAuth();
  const [recruteur, setRecruteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isConducteur = user?.user_metadata?.role === 'conducteur';
  const isAdmin = user?.user_metadata?.role === 'admin';
  const [abonnementActif, setAbonnementActif] = useState(false);
  const hasContact = isAdmin || abonnementActif;

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
    const fetchRecruteur = async () => {
      try {
        const headers = {};
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        const res = await fetch(`${API_URL}/api/recruteurs/${id}`, { headers });
        if (!res.ok) throw new Error('Recruteur introuvable');
        const data = await res.json();
        setRecruteur(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (session !== undefined) fetchRecruteur();
  }, [id, session]);

  if (loading) return <div className="container-custom py-20 text-center">Chargement...</div>;
  if (error) return <div className="container-custom py-20 text-center text-red-600">{error}</div>;
  if (!recruteur) return <div className="container-custom py-20 text-center">Recruteur introuvable</div>;

  const nom = recruteur.nom_entreprise ||
    [recruteur.prenom_responsable, recruteur.nom_responsable].filter(Boolean).join(' ') ||
    'Recruteur';

  const totalVehicules = (recruteur.offres || []).reduce((sum, o) =>
    sum + (o.vehicules || []).reduce((s, v) => s + (parseInt(v.nombre) || 0), 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>{nom} — Recruteur VTC Wikya</title>
        <meta name="description" content={`Profil du recruteur ${nom} sur Wikya. Découvrez ses offres VTC en Côte d'Ivoire.`} />
        <meta property="og:title" content={`${nom} — Recruteur VTC | Wikya`} />
        <meta property="og:description" content={`${nom} recrute des conducteurs VTC en Côte d'Ivoire. Consultez ses offres et postulez sur Wikya.`} />
        <meta property="og:image" content={recruteur.logo_url || 'https://wikya.ci/assets/wikya-logo-new.png'} />
        <meta property="og:url" content={`https://wikya.ci/recruteur/${id}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="Wikya" />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <div className="container-custom max-w-3xl">
        <Link to="/offres" className="text-wikya-orange hover:underline mb-6 inline-block">← Retour aux offres</Link>

        {/* Carte identité */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-6 mb-6">
            {recruteur.logo_url ? (
              <img
                src={recruteur.logo_url}
                alt={nom}
                className={`w-20 h-20 object-contain rounded-xl border bg-gray-50 shrink-0 ${!hasContact && isConducteur ? 'blur-sm' : ''}`}
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-wikya-blue flex items-center justify-center shrink-0">
                <span className="text-3xl text-white font-bold">
                  {recruteur.type_recruteur === 'entreprise'
                    ? (recruteur.nom_entreprise?.[0] || '🏢')
                    : (recruteur.prenom_responsable?.[0] || '👤')}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-wikya-blue mb-1">{nom}</h1>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${recruteur.type_recruteur === 'entreprise' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-wikya-orange'}`}>
                {recruteur.type_recruteur === 'entreprise' ? '🏢 Entreprise' : '👤 Particulier'}
              </span>
              {recruteur.nom_responsable && (
                <p className="text-sm text-gray-500 mt-1">
                  Responsable : {recruteur.prenom_responsable} {recruteur.nom_responsable}
                </p>
              )}
            </div>
            {totalVehicules > 0 && (
              <div className="ml-auto text-right shrink-0">
                <div className="text-3xl font-bold text-wikya-blue">{totalVehicules}</div>
                <div className="text-xs text-gray-500">véhicule{totalVehicules > 1 ? 's' : ''}</div>
              </div>
            )}
          </div>

          {/* Contact */}
          {hasContact && recruteur.telephone ? (
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${recruteur.telephone.replace(/\D/g, '').replace(/^0/, '225')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Contacter sur WhatsApp
              </a>
              <a
                href={`tel:+${recruteur.telephone.replace(/\D/g, '').replace(/^0/, '225')}`}
                className="btn btn-outline"
              >
                📞 Appeler
              </a>
              <span className="text-lg font-bold text-wikya-blue tracking-widest self-center select-all">
                {recruteur.telephone}
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl border-2 border-dashed border-wikya-blue/30 bg-wikya-blue/5">
              {!user ? (
                <>
                  <p className="font-semibold text-wikya-blue mb-1">🔒 Coordonnées masquées</p>
                  <p className="text-sm text-gray-600 mb-3">Connectez-vous en tant que conducteur pour contacter ce recruteur.</p>
                  <Link to="/connexion" className="btn btn-primary text-sm">Se connecter</Link>
                </>
              ) : isConducteur && !abonnementActif ? (
                <>
                  <p className="font-semibold text-wikya-blue mb-1">🔒 Abonnez-vous pour contacter ce recruteur</p>
                  <p className="text-sm text-gray-600 mb-3">Accédez aux contacts directs — 1 000 FCFA pour 2 mois.</p>
                  <Link to="/paiement?role=conducteur" className="btn bg-wikya-orange text-white hover:bg-orange-600 text-sm">S'abonner maintenant</Link>
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Offres */}
        {recruteur.offres?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-wikya-blue">Offres actives ({recruteur.offres.length})</h2>
            {recruteur.offres.map(offre => {
              const nbVehicules = (offre.vehicules || []).reduce((s, v) => s + (parseInt(v.nombre) || 0), 0);
              return (
                <div key={offre.id} className="bg-white rounded-xl shadow-sm p-6">
                  {offre.vehicules?.length > 0 && (
                    <div className="overflow-x-auto mb-4">
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
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {offre.heures_travail && <div><span>🕐</span> {offre.heures_travail}</div>}
                    {offre.jours_travail?.length > 0 && (
                      <div><span>📅</span> {offre.jours_travail.length === 7 ? 'Tous les jours' : offre.jours_travail.join(', ')}</div>
                    )}
                    {offre.garde_vehicule && <div className="col-span-2"><span>🚗</span> {offre.garde_vehicule}</div>}
                    {offre.type_contrat && <div className="col-span-2"><span>📄</span> {offre.type_contrat}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
