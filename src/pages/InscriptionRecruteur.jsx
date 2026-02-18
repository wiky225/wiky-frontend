import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function InscriptionRecruteur() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom_entreprise: '',
    nom_responsable: '',
    prenom_responsable: '',
    email: '',
    telephone: '',
    taille_flotte: '1-5 conducteurs',
    password: '',
    password_confirm: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      // 1. Créer le compte Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { role: 'recruteur' } }
      });
      if (authError) throw authError;

      const token = authData.session?.access_token;

      // 2. Créer le profil recruteur
      const { nom_entreprise, nom_responsable, prenom_responsable,
        email, telephone, taille_flotte } = formData;

      const response = await fetch(`${API_URL}/api/recruteurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          nom_entreprise, nom_responsable, prenom_responsable,
          email, telephone, taille_flotte
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du profil.');
      }

      // 3. Rediriger vers le paiement
      navigate('/paiement');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom max-w-3xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wiky-blue mb-2">Inscription Recruteur</h1>
          <p className="text-wiky-gray mb-8">Accédez à notre répertoire de conducteurs VTC professionnels</p>

          {/* Offre */}
          <div className="bg-wiky-blue text-white rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Abonnement Mensuel</h2>
            <div className="text-4xl font-bold mb-2">10.000 FCFA<span className="text-lg font-normal">/mois</span></div>
            <ul className="space-y-2">
              <li>✅ Accès illimité à 500+ profils conducteurs</li>
              <li>✅ Contact direct avec les conducteurs</li>
              <li>✅ Système de favoris</li>
              <li>✅ Support WhatsApp 24/7</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Nom de l'entreprise *</label>
              <input type="text" name="nom_entreprise" className="input" required onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Nom du responsable *</label>
                <input type="text" name="nom_responsable" className="input" required onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Prénom *</label>
                <input type="text" name="prenom_responsable" className="input" required onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Email professionnel *</label>
              <input type="email" name="email" className="input" required onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Téléphone *</label>
              <input type="tel" name="telephone" className="input" placeholder="+225 XX XX XX XX XX" required onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Mot de passe *</label>
                <input type="password" name="password" className="input" required onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wiky-gray mb-2">Confirmer le mot de passe *</label>
                <input type="password" name="password_confirm" className="input" required onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Taille de la flotte souhaitée</label>
              <select name="taille_flotte" className="input" onChange={handleChange}>
                <option>1-5 conducteurs</option>
                <option>6-10 conducteurs</option>
                <option>11-20 conducteurs</option>
                <option>Plus de 20 conducteurs</option>
              </select>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" required className="mt-1" />
              <label htmlFor="terms" className="text-sm text-wiky-gray">
                J'accepte les conditions d'utilisation et la politique de confidentialité de Wiky
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : 'Continuer vers le Paiement'}
            </button>

            <p className="text-center text-sm text-wiky-gray">
              Déjà inscrit ? <Link to="/connexion" className="text-wiky-blue hover:text-wiky-orange font-semibold">Connectez-vous</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InscriptionRecruteur;
