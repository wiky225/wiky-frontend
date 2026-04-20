import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PhoneInput from '../components/PhoneInput';
import { Turnstile } from '@marsidev/react-turnstile';
import API_URL from '../lib/api.js';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const VILLES_CI = [
  'Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pedro',
  'Korhogo', 'Man', 'Gagnoa', 'Abengourou', 'Divo',
  'Grand-Bassam', 'Agboville', 'Dabou', 'Adzopé',
];

export default function InscriptionConducteur() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirm: '',
    ville: '', annees_experience: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nom || !form.prenom || !form.email || !form.telephone || !form.ville) {
      return setError('Veuillez remplir tous les champs obligatoires.');
    }
    if (form.password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères.');
    }
    if (form.password !== form.password_confirm) {
      return setError('Les mots de passe ne correspondent pas.');
    }
    if (!captchaToken) {
      return setError('Veuillez valider la vérification anti-robot.');
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { role: 'conducteur' },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (authError) throw authError;

      const token = authData.session?.access_token;
      await fetch(`${API_URL}/api/conducteurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          ville: form.ville,
          annees_experience: form.annees_experience || null,
          captchaToken,
        }),
      }).then(async r => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.error || 'Erreur création profil');
        }
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-wikya-blue mb-3">Compte créé !</h2>
          <p className="text-gray-600 mb-2">
            Un email de confirmation a été envoyé à <strong>{form.email}</strong>.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Cliquez sur le lien dans l'email pour activer votre compte. Vous serez ensuite guidé pour compléter votre profil (2 min).
          </p>
          <Link to="/connexion" className="btn btn-primary w-full">
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-wikya-blue">Inscription Conducteur VTC</h1>
          <p className="text-gray-500 text-sm mt-1">Créez votre compte en moins de 2 minutes</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">

          {/* Nom & Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange}
                className="input" placeholder="Ex : Kouassi" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
              <input type="text" name="prenom" value={form.prenom} onChange={handleChange}
                className="input" placeholder="Ex : Jean" required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="input" placeholder="votre@email.com" required />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
            <PhoneInput name="telephone" value={form.telephone} onChange={handleChange} required />
          </div>

          {/* Mot de passe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} className="input pr-10" placeholder="Min. 6 caractères" required />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer *</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} name="password_confirm" value={form.password_confirm}
                  onChange={handleChange} className="input pr-10" placeholder="Répéter" required />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Ville + Expérience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville *</label>
              <select name="ville" value={form.ville} onChange={handleChange} className="input" required>
                <option value="">Sélectionnez...</option>
                {VILLES_CI.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expérience <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <select name="annees_experience" value={form.annees_experience} onChange={handleChange} className="input">
                <option value="">Sélectionnez...</option>
                <option value="Moins d'1 an">Moins d'1 an</option>
                {[...Array(15)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1} an${i + 1 > 1 ? 's' : ''}`}>
                    {i + 1} an{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
                <option value="Plus de 15 ans">Plus de 15 ans</option>
              </select>
            </div>
          </div>

          {/* CGU */}
          <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <input type="checkbox" id="terms" required className="mt-0.5 shrink-0 w-4 h-4 accent-wikya-blue" />
            <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
              J'accepte les{' '}
              <Link to="/conditions-generales" target="_blank" className="text-wikya-blue hover:underline font-semibold">CGU</Link>
              {' '}et la{' '}
              <Link to="/politique-confidentialite" target="_blank" className="text-wikya-blue hover:underline font-semibold">
                Politique de confidentialité
              </Link>{' '}de Wikya.
            </label>
          </div>

          {/* Turnstile */}
          <div className="flex justify-center">
            <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={t => setCaptchaToken(t)} />
          </div>

          <button type="submit" disabled={loading}
            className="btn btn-primary w-full text-base py-4 disabled:opacity-60">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Création en cours...
              </span>
            ) : 'Créer mon compte'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="text-wikya-blue hover:underline font-semibold">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
