import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ConducteurDetail() {
  const { id } = useParams();
  const [conducteur, setConducteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConducteur = async () => {
      try {
        const response = await fetch(`${API_URL}/api/conducteurs/${id}`);
        if (!response.ok) throw new Error('Conducteur non trouvé');
        const data = await response.json();
        setConducteur(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConducteur();
  }, [id]);

  if (loading) return <div className="container-custom py-20 text-center">Chargement...</div>;
  if (error) return <div className="container-custom py-20 text-center text-red-600">{error}</div>;
  if (!conducteur) return <div className="container-custom py-20 text-center">Conducteur introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <Link to="/repertoire" className="text-wiky-orange hover:underline mb-6 inline-block">← Retour au répertoire</Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img 
                src={conducteur.photo_url || `https://ui-avatars.com/api/?name=${conducteur.prenom}+${conducteur.nom}&size=400&background=253b56&color=fff`}
                alt={`${conducteur.prenom} ${conducteur.nom}`}
                className="w-full rounded-lg"
              />
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

              <button className="btn btn-primary mt-8">Contacter ce conducteur</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}