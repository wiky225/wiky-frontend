function Paiement() {
  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom max-w-2xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wiky-blue mb-8">Paiement Sécurisé</h1>
          
          <div className="bg-wiky-gray-light p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold text-wiky-blue mb-4">Récapitulatif</h2>
            <div className="flex justify-between mb-2">
              <span>Abonnement Recruteur (1 mois)</span>
              <span className="font-bold">15.000 FCFA</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-wiky-orange">15.000 FCFA</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-wiky-blue mb-4">Choisissez votre mode de paiement</h3>
            <div className="space-y-3">
              <div className="border-2 border-wiky-blue rounded-lg p-4 cursor-pointer hover:bg-wiky-gray-light">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" id="mobile" defaultChecked />
                  <label htmlFor="mobile" className="flex-grow cursor-pointer">
                    <div className="font-semibold">Mobile Money</div>
                    <div className="text-sm text-wiky-gray">Orange Money, MTN Money, Moov Money</div>
                  </label>
                </div>
              </div>
              <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-wiky-gray-light opacity-50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" id="card" disabled />
                  <label htmlFor="card" className="flex-grow">
                    <div className="font-semibold">Carte Bancaire</div>
                    <div className="text-sm text-wiky-gray">Bientôt disponible</div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-primary w-full text-lg py-4">
            Procéder au Paiement
          </button>

          <p className="text-center text-sm text-wiky-gray mt-4">
            🔒 Paiement sécurisé par CinetPay
          </p>
        </div>
      </div>
    </div>
  )
}

export default Paiement
