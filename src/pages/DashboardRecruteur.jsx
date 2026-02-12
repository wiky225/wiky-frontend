function DashboardRecruteur() {
  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-wiky-blue mb-8">Mon Dashboard Recruteur</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-wiky-blue">8</div>
            <div className="text-sm text-wiky-gray">Favoris</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">📞</div>
            <div className="text-3xl font-bold text-wiky-blue">15</div>
            <div className="text-sm text-wiky-gray">Contacts effectués</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-3xl font-bold text-wiky-blue">18j</div>
            <div className="text-sm text-wiky-gray">Restants</div>
          </div>
        </div>

        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-bold text-wiky-blue mb-4">Mon Abonnement</h2>
          <p className="text-wiky-gray mb-4">Abonnement actif jusqu'au 28 février 2026</p>
          <button className="btn btn-secondary">Renouveler l'Abonnement</button>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-wiky-blue mb-4">Mes Favoris</h2>
          <p className="text-wiky-gray">Retrouvez ici les conducteurs que vous avez ajoutés à vos favoris.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardRecruteur
