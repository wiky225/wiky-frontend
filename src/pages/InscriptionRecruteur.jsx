import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PhoneInput from '../components/PhoneInput';
import { Turnstile } from '@marsidev/react-turnstile';

import API_URL from '../lib/api.js';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

function InscriptionRecruteur() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    type_recruteur: 'entreprise',
    nom_entreprise: '',
    nom_responsable: '',
    prenom_responsable: '',
    email: '',
    telephone: '',
    password: '',
    password_confirm: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
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

    if (!captchaToken) {
      setError('Veuillez confirmer que vous n\'êtes pas un robot.');
      return;
    }

    setLoading(true);
    try {
      // 1. Créer le compte Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { role: 'recruteur' },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (authError) throw authError;

      const token = authData.session?.access_token;

      // 2. Créer le profil recruteur
      const { type_recruteur, nom_entreprise, nom_responsable, prenom_responsable,
        email, telephone } = formData;

      const fd = new FormData();
      fd.append('type_recruteur', type_recruteur);
      fd.append('nom_entreprise', type_recruteur === 'entreprise' ? nom_entreprise : '');
      fd.append('nom_responsable', nom_responsable);
      fd.append('prenom_responsable', prenom_responsable);
      fd.append('email', email);
      fd.append('telephone', telephone);
      fd.append('captchaToken', captchaToken);
      if (logoFile) fd.append('logo', logoFile);

      const response = await fetch(`${API_URL}/api/recruteurs`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: fd
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du profil.');
      }

      // 3. Afficher le succès
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-wikya-gray-light flex items-center justify-center py-12">
        <div className="card p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-wikya-blue mb-3">Compte créé avec succès !</h2>
          <p className="text-wikya-gray mb-2">
            Un email de confirmation a été envoyé à <strong>{formData.email}</strong>.
          </p>
          <p className="text-wikya-gray mb-6">
            Confirmez votre email puis connectez-vous pour accéder à la page de paiement et activer votre abonnement.
          </p>
          <Link to="/connexion" className="btn btn-primary w-full mb-3">
            Aller à la Connexion
          </Link>
          <Link to="/paiement" className="btn btn-secondary w-full">
            Accéder au Paiement maintenant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-wikya-gray-light min-h-screen">
      <div className="container-custom max-w-3xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wikya-blue mb-2">Inscription Recruteur</h1>
          <p className="text-wikya-gray mb-8">Accédez à notre répertoire de conducteurs VTC professionnels</p>

          {/* Offre */}
          <div className="bg-wikya-blue text-white rounded-xl p-6 mb-8">
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

            {/* Type de recruteur */}
            <div>
              <label className="block text-sm font-semibold text-wikya-gray mb-2">Vous êtes *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'entreprise', label: '🏢 Entreprise', desc: 'Société, agence VTC' },
                  { value: 'particulier', label: '👤 Particulier', desc: 'Propriétaire indépendant' }
                ].map(({ value, label, desc }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setFormData(f => ({ ...f, type_recruteur: value }))}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${formData.type_recruteur === value ? 'border-wikya-blue bg-blue-50' : 'border-gray-200 hover:border-wikya-blue'}`}
                  >
                    <div className="font-semibold text-wikya-blue">{label}</div>
                    <div className="text-xs text-gray-500 mt-1">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {formData.type_recruteur === 'entreprise' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-wikya-gray mb-2">Nom de l'entreprise *</label>
                  <input type="text" name="nom_entreprise" className="input" required onChange={handleChange} placeholder="Ex : ATL Cars SARLU" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-wikya-gray mb-2">
                    Logo de l'entreprise <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <img src={logoPreview} alt="Aperçu logo" className="w-16 h-16 object-contain border rounded-lg bg-gray-50" />
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-wikya-blue hover:text-wikya-blue transition-colors">
                      <span>🖼️</span> {logoPreview ? 'Changer le logo' : 'Importer le logo'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG ou SVG · Max 2 Mo · Carré recommandé (ex : 400×400 px)</p>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Nom du responsable *</label>
                <input type="text" name="nom_responsable" className="input" required onChange={handleChange} placeholder="Ex : Kouassi" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Prénom *</label>
                <input type="text" name="prenom_responsable" className="input" required onChange={handleChange} placeholder="Ex : Jean-Marc" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-wikya-gray mb-2">Email professionnel *</label>
              <input type="email" name="email" className="input" required onChange={handleChange} placeholder="Ex : contact@votreentreprise.ci" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wikya-gray mb-2">Téléphone *</label>
              <PhoneInput name="telephone" value={formData.telephone} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Mot de passe *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" className="input pr-10" required onChange={handleChange} placeholder="Min. 6 caractères" />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Masquer' : 'Voir'}>
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Confirmer le mot de passe *</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} name="password_confirm" className="input pr-10" required onChange={handleChange} placeholder="Répéter le mot de passe" />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirm ? 'Masquer' : 'Voir'}>
                    {showConfirm ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="checkbox" id="terms" required className="mt-0.5 shrink-0 w-4 h-4 accent-wikya-blue" />
              <label htmlFor="terms" className="text-sm text-wikya-gray leading-relaxed">
                J'ai lu et j'accepte les{' '}
                <Link to="/conditions-generales" target="_blank" className="text-wikya-blue hover:underline font-semibold">
                  Conditions Générales d'Utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/politique-confidentialite" target="_blank" className="text-wikya-blue hover:underline font-semibold">
                  Politique de confidentialité
                </Link>{' '}
                de Wikya. J'autorise le traitement de mes données personnelles à des fins de recrutement VTC.
              </label>
            </div>

            <div className="flex justify-center">
              <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setCaptchaToken(token)} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : 'Continuer vers le Paiement'}
            </button>

            <p className="text-center text-sm text-wikya-gray">
              Déjà inscrit ? <Link to="/connexion" className="text-wikya-blue hover:text-wikya-orange font-semibold">Connectez-vous</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InscriptionRecruteur;
