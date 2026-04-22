import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import API_URL from '../lib/api.js';

const WAVE_LINKS = {
  conducteur: 'https://pay.wave.com/m/M_jmHLrVUQHD8r/c/ci/?amount=2500',
  recruteur:  'https://pay.wave.com/m/M_jmHLrVUQHD8r/c/ci/?amount=10000',
};

const WHATSAPP_NUMBER = '2250575421717';
const ADMIN_WHATSAPP = '2250575421717';

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

function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function buildConfirmationWhatsApp({ role, montant, prenom, nom, email }) {
  const roleLabel = role === 'conducteur' ? 'Conducteur' : 'Recruteur';
  const msg = [
    `Bonjour Wikya, j'ai effectué mon paiement Wave. ✅`,
    ``,
    `👤 Nom : ${prenom || ''} ${nom || ''}`,
    `📧 Email : ${email || ''}`,
    `🎭 Rôle : ${roleLabel}`,
    `💰 Montant : ${montant} FCFA`,
    ``,
    `Merci d'activer mon abonnement.`,
  ].join('\n');
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

export default function Paiement() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [notified, setNotified] = useState(false);

  const status = searchParams.get('status');
  const roleParam = searchParams.get('role');
  const role = roleParam || user?.user_metadata?.role;
  const config = CONFIG[role];

  const launchEndDate = import.meta.env.VITE_LAUNCH_END_DATE;
  const isLaunchPeriod = launchEndDate ? new Date() < new Date(launchEndDate) : false;
  const launchEndFormatted = launchEndDate
    ? new Date(launchEndDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  useEffect(() => { setIsMobile(isMobileDevice()); }, []);

  const waveLink = WAVE_LINKS[role] || '';
  const prenom = user?.user_metadata?.prenom || '';
  const nom = user?.user_metadata?.nom || '';
  const email = user?.email || '';

  const confirmationWhatsApp = buildConfirmationWhatsApp({
    role, montant: config?.montant, prenom, nom, email,
  });

  const ouvrirWhatsAppEtNotifier = useCallback(async () => {
    if (notified) return;
    // Ouvrir WhatsApp immédiatement
    window.open(confirmationWhatsApp, '_blank');
    setNotified(true);
    // Email de backup en arrière-plan
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        fetch(`${API_URL}/api/paiements/notifier-wave`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(() => {});
      }
    } catch { /* silencieux */ }
  }, [confirmationWhatsApp, notified]);

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
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
            className="text-sm text-wikya-orange hover:underline">
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

          {/* Notice période de lancement conducteur */}
          {isLaunchPeriod && role === 'conducteur' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-green-800 font-semibold mb-1">🎉 Accès gratuit jusqu'au {launchEndFormatted}</p>
              <p className="text-green-700 text-sm">Vous n'avez pas besoin de payer pendant la période de lancement.</p>
              <Link to="/dashboard-conducteur" className="mt-3 inline-block btn bg-green-600 text-white hover:bg-green-700 text-sm">
                Accéder à mon espace →
              </Link>
            </div>
          )}

          {!(isLaunchPeriod && role === 'conducteur') && user && (
            <>
              {/* ── MOBILE : bouton Wave direct ── */}
              {isMobile && (
                <div className="mb-5">
                  <a
                    href={waveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#1A56DB] hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors"
                  >
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payer {config.montant} FCFA avec Wave
                  </a>
                </div>
              )}

              {/* ── DESKTOP : QR code principal ── */}
              {!isMobile && (
                <div className="mb-5">
                  <div className="border-2 border-gray-100 rounded-xl p-6 text-center">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Scannez pour payer via Wave
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Ouvrez l'app Wave sur votre téléphone → Payer → Scanner
                    </p>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 inline-block">
                        <QRCodeSVG
                          value={waveLink}
                          size={160}
                          bgColor="#ffffff"
                          fgColor="#1A56DB"
                          level="M"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                      Montant : <strong className="text-wikya-blue">{config.montant} FCFA</strong>
                    </p>
                    <a href={waveLink} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-wikya-blue hover:underline">
                      Ou ouvrir la page Wave directement →
                    </a>
                  </div>
                </div>
              )}

              {/* ── Bouton confirmation unique ── */}
              <div className="mb-5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3 text-sm text-amber-800 text-center">
                  Après votre paiement, cliquez le bouton ci-dessous — notre équipe activera votre abonnement sous <strong>24h</strong>.
                </div>
                <button
                  onClick={ouvrirWhatsAppEtNotifier}
                  disabled={notified}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm transition-colors ${
                    notified
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-[#25D366] hover:bg-[#1ebe5d] text-white'
                  }`}
                >
                  {notified ? (
                    '✅ Message envoyé — activation sous 24h'
                  ) : (
                    <>
                      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      J'ai effectué mon paiement
                    </>
                  )}
                </button>
              </div>

              {/* ── Providers à venir ── */}
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Autres moyens de paiement — bientôt disponibles
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'MTN MoMo', color: 'bg-yellow-400 text-black' },
                    { label: 'Orange Money', color: 'bg-orange-500 text-white' },
                    { label: 'Wave direct', color: 'bg-blue-500 text-white' },
                  ].map(p => (
                    <div key={p.label}
                      className="relative border-2 border-gray-100 rounded-xl py-3 px-2 text-center text-xs font-semibold text-gray-300 bg-gray-50">
                      {p.label}
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        Bientôt
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!(isLaunchPeriod && role === 'conducteur') && !user && (
            <Link to="/connexion" className="btn btn-primary w-full text-center block">
              Se connecter pour payer
            </Link>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            Un problème ?{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="text-wikya-orange hover:underline">
              WhatsApp 24/7
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
