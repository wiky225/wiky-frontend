import { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../lib/api.js';

const CONFIG = {
  conducteur: {
    label: 'Conducteur',
    montant: '2 500',
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

const PROVIDERS = [
  { id: 'momo', label: 'MTN MoMo', active: true, color: '#FFCC00', textColor: '#1A1A1A' },
  { id: 'wave', label: 'Wave', active: false },
  { id: 'orange', label: 'Orange Money', active: false },
];

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_MS = 120000; // 2 min

export default function Paiement() {
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [provider, setProvider] = useState('momo');
  const [phone, setPhone] = useState('');
  const [pollingState, setPollingState] = useState(null); // null | 'waiting' | 'confirme' | 'echec' | 'timeout'
  const pollingRef = useRef(null);

  const status = searchParams.get('status');
  const roleParam = searchParams.get('role');
  const role = roleParam || user?.user_metadata?.role;
  const config = CONFIG[role];

  const launchEndDate = import.meta.env.VITE_LAUNCH_END_DATE;
  const isLaunchPeriod = launchEndDate ? new Date() < new Date(launchEndDate) : false;
  const launchEndFormatted = launchEndDate
    ? new Date(launchEndDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current.interval);
      clearTimeout(pollingRef.current.timeout);
      pollingRef.current = null;
    }
  }

  async function pollStatut(referenceId, token) {
    try {
      const res = await fetch(`${API_URL}/api/paiements/statut/${referenceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const { statut } = await res.json();
      if (statut === 'confirme') {
        stopPolling();
        setPollingState('confirme');
        setLoading(false);
      } else if (statut === 'echec') {
        stopPolling();
        setPollingState('echec');
        setLoading(false);
      }
    } catch {
      // réseau temporaire, on continue
    }
  }

  const handlePayer = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setErreur('');

    try {
      const body = { role, provider };
      if (provider === 'momo') {
        if (!phone.trim()) {
          setErreur('Veuillez entrer votre numéro MTN');
          setLoading(false);
          return;
        }
        // Formater : +225XXXXXXXXXX → 225XXXXXXXXXX
        body.phone = phone.trim().replace(/^\+/, '');
      }

      const res = await fetch(`${API_URL}/api/paiements/initier`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
      }

      const data = await res.json();

      if (provider === 'momo') {
        const { referenceId } = data;
        setPollingState('waiting');

        const interval = setInterval(() => pollStatut(referenceId, session.access_token), POLL_INTERVAL_MS);
        const timeout = setTimeout(() => {
          stopPolling();
          setPollingState('timeout');
          setLoading(false);
        }, POLL_MAX_MS);

        pollingRef.current = { interval, timeout };
      } else if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      setErreur(err.message);
      setLoading(false);
    }
  };

  // ── SUCCÈS MoMo (polling) ─────────────────────────────────────
  if (pollingState === 'confirme') {
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

  // ── SUCCÈS Wave (redirect return) ────────────────────────────
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

  // ── ERREUR / TIMEOUT ─────────────────────────────────────────
  if (status === 'erreur' || pollingState === 'echec' || pollingState === 'timeout') {
    const message = pollingState === 'timeout'
      ? 'La confirmation MTN n\'a pas été reçue dans le délai imparti. Si votre solde a été débité, contactez-nous.'
      : 'Votre paiement n\'a pas été complété. Vous pouvez réessayer ou nous contacter.';
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-wikya-blue mb-2">Paiement non abouti</h1>
          <p className="text-gray-500 mb-8">{message}</p>
          <button
            onClick={() => { setPollingState(null); window.history.replaceState({}, '', `/paiement?role=${role}`); }}
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

  // ── ATTENTE CONFIRMATION MTN ──────────────────────────────────
  if (pollingState === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse">
              <span className="text-2xl font-bold text-black">M</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-wikya-blue mb-3">En attente de confirmation MTN</h1>
          <p className="text-gray-500 text-sm mb-2">
            Une notification a été envoyée sur le numéro <strong>{phone}</strong>.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Confirmez le paiement sur votre téléphone. Cette page se met à jour automatiquement.
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-wikya-orange rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
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
          <p className="text-gray-400 text-sm mb-6">Paiement mobile sécurisé</p>

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

          {/* Sélecteur provider */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Moyen de paiement
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => p.active && setProvider(p.id)}
                  disabled={!p.active}
                  className={[
                    'relative border-2 rounded-xl py-3 px-2 text-center transition-all text-sm font-semibold',
                    p.active && provider === p.id
                      ? 'border-wikya-orange bg-orange-50 text-wikya-orange'
                      : p.active
                        ? 'border-gray-200 text-gray-700 hover:border-gray-300'
                        : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50',
                  ].join(' ')}
                >
                  {p.label}
                  {!p.active && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      Bientôt
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Saisie numéro MTN */}
          {provider === 'momo' && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Numéro MTN MoMo
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-wikya-orange transition-colors">
                <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-200 shrink-0">
                  +225
                </span>
                <input
                  type="tel"
                  value={phone.replace(/^\+?225/, '')}
                  onChange={e => setPhone('225' + e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="01 23 45 67 89"
                  className="flex-1 px-3 py-3 text-sm outline-none bg-white"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Vous recevrez une notification de confirmation sur ce numéro.
              </p>
            </div>
          )}

          {/* Notice période de lancement conducteur */}
          {isLaunchPeriod && role === 'conducteur' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
              <p className="text-green-800 font-semibold mb-1">🎉 Accès gratuit jusqu'au {launchEndFormatted}</p>
              <p className="text-green-700 text-sm">Vous n'avez pas besoin de payer pendant la période de lancement.</p>
              <Link to="/dashboard-conducteur" className="mt-3 inline-block btn bg-green-600 text-white hover:bg-green-700 text-sm">
                Accéder à mon espace →
              </Link>
            </div>
          )}

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {erreur}
            </div>
          )}

          {!(isLaunchPeriod && role === 'conducteur') && (
            user ? (
              <button
                onClick={handlePayer}
                disabled={loading}
                className="btn btn-primary w-full text-base py-4 disabled:opacity-60"
              >
                {loading
                  ? 'Envoi de la demande...'
                  : `Payer ${config.montant} FCFA${provider === 'momo' ? ' via MTN MoMo' : ''}`}
              </button>
            ) : (
              <Link
                to="/connexion"
                className="btn btn-primary w-full text-center block"
              >
                Se connecter pour payer
              </Link>
            )
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
