function DashboardConducteur() {
  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-wiky-blue mb-8">Mon Dashboard Conducteur</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-4xl mb-2">👁️</div>
            <div className="text-3xl font-bold text-wiky-blue">247</div>
            <div className="text-sm text-wiky-gray">Vues du profil</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-wiky-blue">12</div>
            <div className="text-sm text-wiky-gray">Favoris</div>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-2">📞</div>
            <div className="text-3xl font-bold text-wiky-blue">5</div>
            <div className="text-sm text-wiky-gray">Contacts reçus</div>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-wiky-blue mb-4">Mon Profil</h2>
          <p className="text-wiky-gray">Gérez vos informations personnelles et votre visibilité sur la plateforme.</p>
          <button className="btn btn-primary mt-4">Modifier Mon Profil</button>
        </div>
      </div>
    </div>
  )
}

export default DashboardConducteur
