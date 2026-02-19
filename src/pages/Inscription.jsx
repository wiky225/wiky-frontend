import { Link } from 'react-router-dom';

export default function Inscription() {
  return (
    <div className="min-h-screen bg-wiky-gray-light flex items-center justify-center py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold text-wiky-blue text-center mb-3">Créer un compte</h1>
        <p className="text-wiky-gray text-center mb-10">Choisissez votre profil pour commencer</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Conducteur */}
          <div className="card p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-wiky-blue mb-3">Je suis Conducteur</h2>
            <p className="text-wiky-gray mb-6">
              Créez votre profil VTC et soyez visible auprès des recruteurs de toute la Côte d'Ivoire.
            </p>
            <ul className="text-sm text-wiky-gray text-left space-y-2 mb-8 w-full">
              <li>✅ Profil visible dans le répertoire</li>
              <li>✅ Mise en favori par les recruteurs</li>
              <li>✅ Inscription gratuite</li>
            </ul>
            <Link to="/inscription-conducteur" className="btn btn-primary w-full">
              S'inscrire comme Conducteur
            </Link>
          </div>

          {/* Recruteur */}
          <div className="card p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-wiky-blue mb-3">Je suis Recruteur</h2>
            <p className="text-wiky-gray mb-6">
              Accédez à notre répertoire de conducteurs VTC professionnels et recrutez facilement.
            </p>
            <ul className="text-sm text-wiky-gray text-left space-y-2 mb-8 w-full">
              <li>✅ Accès à 500+ profils conducteurs</li>
              <li>✅ Contact direct avec les conducteurs</li>
              <li>✅ 10.000 FCFA/mois</li>
            </ul>
            <Link to="/inscription-recruteur" className="btn btn-secondary w-full">
              S'inscrire comme Recruteur
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-wiky-gray mt-8">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-wiky-blue hover:text-wiky-orange font-semibold">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
