export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">

          <h1 className="text-3xl font-bold text-wikya-blue mb-2">Politique de confidentialité</h1>
          <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : février 2026</p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-10 text-sm text-gray-600">
            Wikya by ATL Cars s'engage à protéger la vie privée de ses utilisateurs conformément à la{' '}
            <strong>loi n°2013-450 du 19 juin 2013</strong> relative à la protection des données à caractère
            personnel en République de Côte d'Ivoire.
          </div>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">1. Responsable du traitement</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              ATL Cars, exploitant la marque Wikya, dont le siège social est à Abidjan, Côte d'Ivoire,
              est responsable du traitement de vos données personnelles.
              Contact : <a href="mailto:contact@wikya.ci" className="text-wikya-blue hover:underline">contact@wikya.ci</a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">2. Données collectées</h2>
            <div className="space-y-6 text-sm text-gray-600">

              <div>
                <p className="font-semibold text-gray-700 mb-2">Pour les conducteurs VTC</p>
                <ul className="space-y-1.5 ml-4 list-disc">
                  <li>Identité : nom, prénom, sexe, date de naissance, nationalité</li>
                  <li>Coordonnées : email, téléphone, adresse (ville, commune, quartier)</li>
                  <li>Documents d'identité : type et numéro de pièce, permis de conduire (recto/verso)</li>
                  <li>Informations professionnelles : expérience VTC, plateformes utilisées, disponibilité</li>
                  <li>Informations personnelles : situation matrimoniale, nombre d'enfants (facultatif)</li>
                  <li>Photo de profil</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Pour les recruteurs</p>
                <ul className="space-y-1.5 ml-4 list-disc">
                  <li>Identité du responsable : nom, prénom</li>
                  <li>Informations professionnelles : nom de l'entreprise, type de recruteur</li>
                  <li>Coordonnées : email, téléphone</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Données de paiement</p>
                <p>
                  Les paiements sont traités par <strong>Wave</strong>. Wikya ne stocke aucune donnée bancaire.
                  Seuls l'identifiant de transaction et le statut du paiement sont conservés.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">3. Finalités du traitement</h2>
            <ul className="space-y-2 text-sm text-gray-600 ml-4 list-disc">
              <li>Création et gestion des comptes utilisateurs</li>
              <li>Mise en relation entre conducteurs VTC et recruteurs</li>
              <li>Affichage du profil conducteur dans le répertoire</li>
              <li>Gestion des abonnements et paiements</li>
              <li>Envoi de notifications (rappels d'abonnement) par WhatsApp et email</li>
              <li>Amélioration de la qualité du service</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">4. Accès aux données</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">Sans abonnement actif (conducteur)</p>
                <p>Seules les informations générales sont visibles (nom, expérience, localisation, statut).
                Les coordonnées de contact sont masquées.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">Recruteur abonné</p>
                <p>Accès aux coordonnées et documents du conducteur abonné uniquement.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">Équipe Wikya</p>
                <p>Accès complet aux données pour la gestion de la plateforme et le support.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">5. Conservation des données</h2>
            <ul className="space-y-2 text-sm text-gray-600 ml-4 list-disc">
              <li>Compte actif : données conservées tant que le compte existe</li>
              <li>Compte inactif (aucune connexion depuis 2 ans) : données archivées puis supprimées</li>
              <li>Données de paiement : conservées 5 ans (obligation comptable)</li>
              <li>Documents d'identité : supprimés sur demande ou à la clôture du compte</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">6. Vos droits</h2>
            <p className="text-sm text-gray-600 mb-4">
              Conformément à la loi n°2013-450, vous disposez des droits suivants :
            </p>
            <ul className="space-y-2 text-sm text-gray-600 ml-4 list-disc">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger vos informations inexactes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de votre compte et de vos données</li>
              <li><strong>Droit d'opposition :</strong> vous opposer à certains traitements</li>
            </ul>
            <div className="mt-4 bg-wikya-blue/5 border border-wikya-blue/20 rounded-lg p-4 text-sm text-gray-600">
              Pour exercer vos droits, contactez-nous à{' '}
              <a href="mailto:contact@wikya.ci" className="text-wikya-blue hover:underline font-semibold">
                contact@wikya.ci
              </a>{' '}
              ou via WhatsApp au{' '}
              <a href="https://wa.me/2250575421717" target="_blank" rel="noopener noreferrer"
                className="text-wikya-blue hover:underline font-semibold">
                +225 05 75 42 17 17
              </a>.
              Nous traitons votre demande sous 30 jours.
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">7. Sécurité</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wikya met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              chiffrement HTTPS, authentification sécurisée via Supabase, accès restreint aux données sensibles,
              hébergement sur des infrastructures certifiées. Malgré ces précautions, aucun système n'est
              infaillible. En cas de violation de données, vous en serez informé dans les meilleurs délais.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">8. Sous-traitants</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-600 border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Prestataire</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Rôle</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Données transmises</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Supabase', 'Base de données & authentification', 'Toutes les données utilisateurs'],
                    ['Cloudinary', 'Stockage des photos et documents', 'Photos de profil, permis de conduire'],
                    ['Wave', 'Paiement en ligne', 'Montant, référence de transaction'],
                    ['Brevo', 'Envoi d\'emails', 'Email, prénom'],
                    ['Meta (WhatsApp)', 'Notifications WhatsApp', 'Numéro de téléphone, message'],
                    ['Vercel', 'Hébergement frontend', 'Aucune donnée personnelle'],
                    ['Render', 'Hébergement backend', 'Aucune donnée personnelle'],
                  ].map(([p, r, d]) => (
                    <tr key={p} className="border border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-medium">{p}</td>
                      <td className="p-3">{r}</td>
                      <td className="p-3">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">9. Modifications</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wikya se réserve le droit de modifier cette politique de confidentialité à tout moment.
              Les utilisateurs seront informés de toute modification significative par email ou via la plateforme.
              La date de dernière mise à jour est indiquée en haut de cette page.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
