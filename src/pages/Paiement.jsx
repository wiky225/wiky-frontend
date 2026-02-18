const WAVE_PAYMENT_URL = import.meta.env.VITE_WAVE_PAYMENT_URL;

function Paiement() {
  const handlePaiement = () => {
    if (!WAVE_PAYMENT_URL) {
      alert('Lien de paiement non configuré. Contactez-nous sur WhatsApp.');
      return;
    }
    window.open(WAVE_PAYMENT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom max-w-2xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wiky-blue mb-8">Paiement</h1>

          {/* Récapitulatif */}
          <div className="bg-wiky-gray-light p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold text-wiky-blue mb-4">Récapitulatif</h2>
            <div className="flex justify-between mb-2">
              <span>Abonnement Recruteur (1 mois)</span>
              <span className="font-bold">10.000 FCFA</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-wiky-orange">10.000 FCFA</span>
            </div>
          </div>

          {/* Wave */}
          <div className="border-2 border-wiky-blue rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">W</div>
              <div>
                <div className="font-bold text-lg">Wave</div>
                <div className="text-sm text-wiky-gray">Paiement mobile instantané</div>
              </div>
            </div>
            <p className="text-sm text-wiky-gray">
              Vous serez redirigé vers la page de paiement Wave sécurisée.
              Une fois le paiement confirmé, votre accès sera activé sous 24h.
            </p>
          </div>

          <button
            onClick={handlePaiement}
            className="btn btn-primary w-full text-lg py-4"
          >
            Payer 10.000 FCFA avec Wave
          </button>

          <p className="text-center text-sm text-wiky-gray mt-4">
            Besoin d'aide ? Contactez-nous sur WhatsApp après votre paiement.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Paiement
