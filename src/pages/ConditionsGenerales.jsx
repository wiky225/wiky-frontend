export default function ConditionsGenerales() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">

          <h1 className="text-3xl font-bold text-wikya-blue mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : février 2026</p>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">1. Présentation de la plateforme</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Wikya est une plateforme numérique éditée par ATL Cars, dont l'objet est la mise en relation entre
              des conducteurs VTC (Véhicules de Transport avec Chauffeur) et des recruteurs (entreprises ou
              particuliers propriétaires de véhicules) en Côte d'Ivoire.
              Wikya agit exclusivement en tant qu'intermédiaire de mise en relation et ne saurait être considéré
              comme employeur, agence d'intérim ou partie à un contrat de travail.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">2. Acceptation des conditions</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              L'utilisation de la plateforme Wikya implique l'acceptation pleine et entière des présentes
              Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, vous devez cesser
              immédiatement d'utiliser la plateforme. Ces CGU peuvent être modifiées à tout moment ;
              les utilisateurs en seront informés et leur utilisation continue vaudra acceptation.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">3. Création de compte</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Pour accéder aux fonctionnalités de la plateforme, chaque utilisateur doit créer un compte en
              fournissant des informations exactes, complètes et à jour.</p>
              <p>L'utilisateur s'engage à :</p>
              <ul className="ml-4 space-y-1.5 list-disc">
                <li>Ne créer qu'un seul compte par personne</li>
                <li>Maintenir la confidentialité de ses identifiants de connexion</li>
                <li>Informer immédiatement Wikya de toute utilisation non autorisée de son compte</li>
                <li>Fournir des documents authentiques lors de l'inscription</li>
              </ul>
              <p>Wikya se réserve le droit de suspendre ou supprimer tout compte dont les informations
              s'avèrent inexactes ou frauduleuses.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">4. Abonnements et paiements</h2>
            <div className="space-y-4 text-sm text-gray-600">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-700 mb-2">Conducteurs VTC</p>
                <ul className="space-y-1.5 list-disc ml-4">
                  <li>Abonnement : <strong>2 500 FCFA</strong> tous les 2 mois</li>
                  <li>Sans abonnement actif, le profil est visible mais les coordonnées de contact sont masquées</li>
                  <li>Période de grâce de 2 jours après expiration avant désactivation des contacts</li>
                  <li>Rappels envoyés 15 jours et 3 jours avant expiration</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-700 mb-2">Recruteurs</p>
                <ul className="space-y-1.5 list-disc ml-4">
                  <li>Abonnement : <strong>10 000 FCFA</strong> par mois</li>
                  <li>Sans abonnement actif, l'accès au répertoire complet est suspendu immédiatement</li>
                  <li>Rappels envoyés 15 jours et 3 jours avant expiration</li>
                </ul>
              </div>

              <p>Les paiements sont effectués via <strong>Wave</strong> et sont non remboursables sauf en cas
              d'erreur technique avérée de la plateforme. En cas de problème de paiement, contactez-nous
              à <a href="mailto:contact@wikya.ci" className="text-wikya-blue hover:underline">contact@wikya.ci</a>.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">5. Obligations des conducteurs</h2>
            <ul className="space-y-2 text-sm text-gray-600 ml-4 list-disc">
              <li>Fournir des informations exactes sur leur expérience, disponibilité et documents</li>
              <li>Maintenir leurs informations de profil à jour</li>
              <li>Détenir un permis de conduire valide adapté à la conduite VTC</li>
              <li>Ne pas usurper l'identité d'un tiers</li>
              <li>Respecter les recruteurs dans leurs échanges via la plateforme</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">6. Obligations des recruteurs</h2>
            <ul className="space-y-2 text-sm text-gray-600 ml-4 list-disc">
              <li>Utiliser les données des conducteurs uniquement à des fins de recrutement VTC</li>
              <li>Ne pas partager, revendre ou transférer les coordonnées des conducteurs à des tiers</li>
              <li>Respecter la dignité et la vie privée des conducteurs dans leurs échanges</li>
              <li>Publier des offres d'emploi sincères et conformes à la réalité</li>
              <li>Ne pas contacter les conducteurs à des fins non professionnelles</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">7. Contenu interdit</h2>
            <p className="text-sm text-gray-600 mb-3">Il est strictement interdit sur la plateforme de :</p>
            <ul className="space-y-2 text-sm text-gray-600 ml-4 list-disc">
              <li>Publier des informations fausses ou trompeuses</li>
              <li>Télécharger des documents frauduleux ou appartenant à une autre personne</li>
              <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
              <li>Utiliser la plateforme à des fins illégales</li>
              <li>Tenter de contourner les mécanismes de sécurité ou d'accès</li>
              <li>Scraper ou extraire massivement les données du répertoire</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">8. Limitation de responsabilité</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Wikya est une plateforme d'intermédiation. À ce titre :</p>
              <ul className="ml-4 space-y-1.5 list-disc">
                <li>Wikya n'est pas partie aux contrats conclus entre conducteurs et recruteurs</li>
                <li>Wikya ne garantit pas la conclusion d'un contrat de travail ou de collaboration</li>
                <li>Wikya ne vérifie pas en temps réel l'authenticité de chaque document uploadé</li>
                <li>Wikya ne peut être tenu responsable des comportements des utilisateurs entre eux</li>
              </ul>
              <p>En cas de litige entre un conducteur et un recruteur, les parties doivent le résoudre directement.
              Wikya peut être sollicité comme médiateur à titre exceptionnel.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">9. Suspension et suppression de compte</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Wikya se réserve le droit de suspendre ou supprimer tout compte en cas de :</p>
              <ul className="ml-4 space-y-1.5 list-disc">
                <li>Violation des présentes CGU</li>
                <li>Fourniture d'informations frauduleuses</li>
                <li>Comportement inapproprié signalé par d'autres utilisateurs</li>
                <li>Non-paiement de l'abonnement</li>
              </ul>
              <p>L'utilisateur peut également demander la suppression de son compte à tout moment en contactant
              <a href="mailto:contact@wikya.ci" className="text-wikya-blue hover:underline ml-1">contact@wikya.ci</a>.
              Les données seront supprimées dans un délai de 30 jours, à l'exception des données conservées
              par obligation légale.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">10. Propriété intellectuelle</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              La marque Wikya, le logo, le design et l'ensemble du contenu de la plateforme sont la propriété
              exclusive de ATL Cars. L'utilisateur concède à Wikya une licence non exclusive et gratuite
              d'utilisation de son contenu (profil, photo) pour les besoins de la mise en relation sur la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">11. Droit applicable et litiges</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Les présentes CGU sont soumises au droit ivoirien. En cas de litige relatif à leur interprétation
              ou à leur exécution, les parties s'engagent à rechercher une solution amiable dans un délai de
              30 jours. À défaut, le litige sera soumis aux tribunaux compétents d'Abidjan.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
