import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API_URL from '../lib/api.js';

const CONFIG = {
  conducteur: {
    label: 'Conducteur',
    montant: '1 000',
    duree: '2 mois',
    avantages: [
      'Profil contactable par tous les recruteurs abonnés',
      'Vos coordonnées visibles dans le répertoire',
      'Recevoir des propositions directement sur WhatsApp',
    ],
  },
  recruteur: {
    label: 'Recruteur',
    montant: '10 000',
    duree: '1 mois',
    avantages: [
      'Accès complet au répertoire des conducteurs',
      'Coordonnées et documents visibles',
      'Contact direct par WhatsApp ou téléphone',
      'Gestion de vos favoris',
    ],
  },
};

export default function Paiement() {
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const status = searchParams.get('status');
  const roleParam = searchParams.get('role');
  const role = roleParam || user?.user_metadata?.role;
  const config = CONFIG[role];

  const handlePayer = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setErreur('');
    try {
      const res = await fetch(`${API_URL}/api/paiements/initier`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
      }
      const { checkout_url } = await res.json();
      window.location.href = checkout_url;
    } catch (err) {
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCÈS ────────────────────────────────────────────────────
  if (status === 'succes') {
    const dashPath = role === 'conducteur' ? '/dashboard-conducteur' : '/dashboard-recruteur';
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-wikya-blue mb-2">Paiement confirmé !</h1>
          <p className="text-gray-500 mb-8">
            Votre abonnement est maintenant actif. Profitez pleinement de la plateforme.
          </p>
          <Link to={dashPath} className="btn btn-primary w-full block text-center">
            Accéder à mon espace →
          </Link>
        </div>
      </div>
    );
  }

  // ── ERREUR ────────────────────────────────────────────────────
  if (status === 'erreur') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-wikya-blue mb-2">Paiement non abouti</h1>
          <p className="text-gray-500 mb-8">
            Votre paiement n'a pas été complété. Vous pouvez réessayer ou nous contacter.
          </p>
          <button
            onClick={() => window.location.replace(`/paiement?role=${role}`)}
            className="btn btn-primary w-full mb-3"
          >
            Réessayer
          </button>
          <a
            href="https://wa.me/2250575421717"
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-wikya-orange hover:underline"
          >
            Besoin d'aide ? Contactez-nous sur WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // ── RÔLE NON RECONNU ─────────────────────────────────────────
  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Page non disponible.</p>
          <Link to="/" className="text-wikya-blue hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  // ── PAGE PRINCIPALE ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-wikya-blue mb-1">
            Abonnement {config.label}
          </h1>
          <p className="text-gray-400 text-sm mb-6">Paiement sécurisé via Wave</p>

          {/* Récapitulatif */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-gray-500">Abonnement {config.label}</span>
              <span className="font-semibold text-wikya-blue">{config.montant} FCFA</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
              <span>Durée</span>
              <span>{config.duree}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-wikya-orange">{config.montant} FCFA</span>
            </div>
          </div>

          {/* Avantages */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Ce que vous obtenez
            </p>
            <ul className="space-y-2">
              {config.avantages.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Wave */}
          <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
              W
            </div>
            <div>
              <p className="font-semibold text-sm text-wikya-blue">Paiement Wave</p>
              <p className="text-xs text-gray-500">
                Vous serez redirigé vers Wave. L'activation est immédiate après confirmation.
              </p>
            </div>
          </div>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {erreur}
            </div>
          )}

          {user ? (
            <button
              onClick={handlePayer}
              disabled={loading}
              className="btn btn-primary w-full text-base py-4 disabled:opacity-60"
            >
              {loading ? 'Connexion à Wave...' : `Payer ${config.montant} FCFA avec Wave`}
            </button>
          ) : (
            <Link
              to={`/connexion`}
              className="btn btn-primary w-full text-center block"
            >
              Se connecter pour payer
            </Link>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">
            Un problème ?{' '}
            <a
              href="https://wa.me/2250575421717"
              target="_blank" rel="noopener noreferrer"
              className="text-wikya-orange hover:underline"
            >
              WhatsApp 24/7
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
