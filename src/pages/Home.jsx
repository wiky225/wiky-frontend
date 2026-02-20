import { Link } from 'react-router-dom'
import AdBanner from '../components/AdBanner'

function Home() {
  const stats = [
    { number: '500+', label: 'Conducteurs Inscrits' },
    { number: '87', label: 'Nouveaux (7 jours)' },
    { number: '465', label: 'Conducteurs Actifs' },
    { number: '24/7', label: 'Assistance WhatsApp' }
  ]

  const features = [
    {
      icon: '✓',
      title: 'Profils Vérifiés',
      description: 'Tous les conducteurs sont vérifiés avec permis de conduire et documents d\'identité validés.',
      badge: null
    },
    {
      icon: '🎯',
      title: 'Matching Intelligent',
      description: 'Notre algorithme vous suggère les meilleurs profils selon vos critères de localisation et d\'expérience.',
      badge: 'NOUVEAU'
    },
    {
      icon: '💬',
      title: 'Assistance WhatsApp',
      description: 'Support disponible 24/7 via WhatsApp pour répondre à toutes vos questions.',
      badge: 'NOUVEAU'
    },
    {
      icon: '💰',
      title: 'Tarif Transparent',
      description: 'Abonnement simple à 10.000 FCFA/mois. Accès illimité aux profils pendant 30 jours.',
      badge: null
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-wiky text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trouvez votre <span className="text-wiky-orange">Conducteur VTC</span> idéal
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            La première plateforme de mise en relation entre conducteurs professionnels et recruteurs en Côte d'Ivoire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/repertoire" className="btn btn-secondary text-lg px-8 py-4">
              Voir les Conducteurs
            </Link>
            <Link to="/inscription-recruteur" className="btn bg-white text-wiky-blue hover:bg-gray-100 text-lg px-8 py-4">
              Je Recrute
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-wiky-gray-light rounded-xl hover:-translate-y-1 transition-transform"
              >
                <div className="text-4xl font-bold text-wiky-blue mb-2">{stat.number}</div>
                <div className="text-sm text-wiky-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bannière publicitaire */}
      <AdBanner position="home-leaderboard" className="py-4 bg-white" />

      {/* Features Section */}
      <section className="py-20 bg-wiky-gray-light">
        <div className="container-custom">
          <h2 className="section-title">Pourquoi Choisir Wiky ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:-translate-y-2 transition-transform">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-wiky-blue mb-3">{feature.title}</h3>
                <p className="text-wiky-gray text-sm leading-relaxed mb-3">
                  {feature.description}
                </p>
                {feature.badge && (
                  <span className="inline-block px-3 py-1 bg-wiky-orange text-white text-xs font-semibold rounded-full">
                    {feature.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-orange text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Prêt à Trouver Votre Conducteur ?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Rejoignez des centaines de recruteurs qui font confiance à Wiky
          </p>
          <Link to="/inscription-recruteur" className="btn bg-white text-wiky-orange hover:bg-gray-100 text-lg px-8 py-4">
            Commencer Maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
