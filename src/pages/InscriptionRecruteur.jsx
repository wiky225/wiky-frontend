import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PhoneInput from '../components/PhoneInput';
import { Turnstile } from '@marsidev/react-turnstile';
import API_URL from '../lib/api.js';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const EyeOpen = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOff = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

function StepIndicator({ step }) {
  const steps = ['Votre profil', 'Votre compte'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
              done ? 'bg-green-500 text-white' : active ? 'bg-wikya-blue text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {done ? '✓' : n}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${active ? 'text-wikya-blue' : done ? 'text-green-600' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 rounded mx-1 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InscriptionRecruteur() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const turnstileRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const validateStep1 = () => {
    if (formData.type_recruteur === 'entreprise' && !formData.nom_entreprise.trim()) {
      setError('Veuillez saisir le nom de votre entreprise.');
      return false;
    }
    if (!formData.nom_responsable.trim() || !formData.prenom_responsable.trim()) {
      setError('Veuillez saisir le nom et le prénom du responsable.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
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
    if (!termsAccepted) {
      setError('Veuillez accepter les conditions générales.');
      return;
    }
    if (!captchaToken) {
      setError('Veuillez confirmer que vous n\'êtes pas un robot.');
      return;
    }

    setLoading(true);
    try {
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
      const { type_recruteur, nom_entreprise, nom_responsable, prenom_responsable, email, telephone } = formData;

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
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: fd
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du profil.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
      setCaptchaToken(null);
      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCÈS ────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-wikya-gray-light flex items-center justify-center py-12 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-wikya-blue mb-3">Compte créé avec succès !</h2>
          <p className="text-wikya-gray mb-2">
            Un email de confirmation a été envoyé à <strong>{formData.email}</strong>.
          </p>
          <p className="text-wikya-gray mb-6">
            Confirmez votre email puis connectez-vous pour activer votre abonnement.
          </p>
          <Link to="/connexion" className="btn btn-primary w-full mb-3">
            Aller à la Connexion
          </Link>
          <Link to="/paiement?role=recruteur" className="btn btn-secondary w-full">
            Accéder au Paiement maintenant
          </Link>
        </div>
      </div>
    );
  }

  // ── FORMULAIRE ────────────────────────────────────────────────
  return (
    <div className="py-8 bg-wikya-gray-light min-h-screen">
      <div className="container-custom max-w-lg">

        {/* Titre */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-wikya-blue mb-1">Inscription Recruteur</h1>
          <p className="text-wikya-gray text-sm">Accédez à notre répertoire de conducteurs VTC professionnels</p>
        </div>

        {/* Pricing compact */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-xs font-medium text-wikya-gray">
          <span className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 shadow-sm border">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            500+ profils conducteurs
          </span>
          <span className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 shadow-sm border">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Support WhatsApp 24/7
          </span>
          <span className="bg-wikya-orange text-white rounded-full px-3 py-1.5 font-bold">
            10 000 FCFA / mois
          </span>
        </div>

        <div className="card p-6 md:p-8">
          <StepIndicator step={step} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* ── ÉTAPE 1 — PROFIL ───────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Vous êtes *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'entreprise', label: 'Entreprise', desc: 'Société, agence VTC',
                      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
                    { value: 'particulier', label: 'Particulier', desc: 'Propriétaire indépendant',
                      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
                  ].map(({ value, label, desc, icon }) => (
                    <button
                      key={value} type="button"
                      onClick={() => setFormData(f => ({ ...f, type_recruteur: value }))}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${formData.type_recruteur === value ? 'border-wikya-blue bg-blue-50' : 'border-gray-200 hover:border-wikya-blue'}`}
                    >
                      <div className={`mb-2 ${formData.type_recruteur === value ? 'text-wikya-blue' : 'text-gray-400'}`}>{icon}</div>
                      <div className="font-semibold text-wikya-blue text-sm">{label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nom entreprise + logo */}
              {formData.type_recruteur === 'entreprise' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-wikya-gray mb-2">Nom de l'entreprise *</label>
                    <input type="text" name="nom_entreprise" className="input" value={formData.nom_entreprise} onChange={handleChange} placeholder="Ex : ATL Cars SARLU" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-wikya-gray mb-2">
                      Logo <span className="text-gray-400 font-normal">(optionnel)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {logoPreview && (
                        <img src={logoPreview} alt="Logo" className="w-14 h-14 object-contain border rounded-lg bg-gray-50 shrink-0" />
                      )}
                      <label className="cursor-pointer flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-wikya-blue hover:text-wikya-blue transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {logoPreview ? 'Changer le logo' : 'Importer le logo'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">JPG, PNG · Max 2 Mo · Carré recommandé</p>
                  </div>
                </>
              )}

              {/* Nom / Prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-wikya-gray mb-2">Nom *</label>
                  <input type="text" name="nom_responsable" className="input" value={formData.nom_responsable} onChange={handleChange} placeholder="Ex : Kouassi" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-wikya-gray mb-2">Prénom *</label>
                  <input type="text" name="prenom_responsable" className="input" value={formData.prenom_responsable} onChange={handleChange} placeholder="Ex : Jean-Marc" />
                </div>
              </div>

              <button type="button" onClick={handleNext} className="btn btn-primary w-full py-4 text-base mt-2">
                Continuer →
              </button>

              <p className="text-center text-sm text-wikya-gray">
                Déjà inscrit ? <Link to="/connexion" className="text-wikya-blue hover:text-wikya-orange font-semibold">Connectez-vous</Link>
              </p>
            </div>
          )}

          {/* ── ÉTAPE 2 — COMPTE ───────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Email professionnel *</label>
                <input type="email" name="email" className="input" required value={formData.email} onChange={handleChange} placeholder="Ex : contact@votreentreprise.ci" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Téléphone *</label>
                <PhoneInput name="telephone" value={formData.telephone} onChange={handleChange} required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Mot de passe *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" className="input pr-10" required value={formData.password} onChange={handleChange} placeholder="Min. 6 caractères" />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Masquer' : 'Voir'}>
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-wikya-gray mb-2">Confirmer le mot de passe *</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} name="password_confirm" className="input pr-10" required value={formData.password_confirm} onChange={handleChange} placeholder="Répéter le mot de passe" />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirm ? 'Masquer' : 'Voir'}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              {/* CGU — grande zone de tap */}
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <div
                  onClick={() => setTermsAccepted(v => !v)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${termsAccepted ? 'bg-wikya-blue border-wikya-blue' : 'border-gray-300 bg-white'}`}
                >
                  {termsAccepted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-wikya-gray leading-relaxed">
                  J'accepte les{' '}
                  <Link to="/conditions-generales" target="_blank" className="text-wikya-blue hover:underline font-semibold">CGU</Link>
                  {' '}et la{' '}
                  <Link to="/politique-confidentialite" target="_blank" className="text-wikya-blue hover:underline font-semibold">Politique de confidentialité</Link>
                  {' '}de Wikya.
                </span>
              </label>

              <div className="flex justify-center">
                <Turnstile ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setCaptchaToken(token)} onError={() => setCaptchaToken(null)} onExpire={() => setCaptchaToken(null)} />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setStep(1); setError(null); }}
                  className="btn btn-outline px-6 py-4">
                  ← Retour
                </button>
                <button type="submit" disabled={loading}
                  className="btn btn-primary flex-1 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? 'Inscription en cours...' : 'Créer mon compte →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default InscriptionRecruteur;
