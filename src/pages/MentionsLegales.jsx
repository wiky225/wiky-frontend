export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">

          <h1 className="text-3xl font-bold text-wikya-blue mb-2">Mentions légales</h1>
          <p className="text-gray-400 text-sm mb-10">Conformément à la loi n°2013-450 du 19 juin 2013</p>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">1. Éditeur du site</h2>
            <div className="space-y-2 text-gray-600 text-sm leading-relaxed">
              <p><span className="font-semibold text-gray-700">Raison sociale :</span> ABDEONA TRANSPORT LOGISTIQUE</p>
              <p><span className="font-semibold text-gray-700">Nom commercial :</span> Wikya by ATL Cars</p>
              <p><span className="font-semibold text-gray-700">Forme juridique :</span> SARLU</p>
              <p><span className="font-semibold text-gray-700">Capital social :</span> 1 000 000 FCFA</p>
              <p><span className="font-semibold text-gray-700">RCCM :</span> CI-ABJ-03-2022-B13-10957</p>
              <p><span className="font-semibold text-gray-700">Siège social :</span> Abidjan, Côte d'Ivoire</p>
              <p><span className="font-semibold text-gray-700">Email :</span>{' '}
                <a href="mailto:contact@wikya.ci" className="text-wikya-blue hover:underline">contact@wikya.ci</a>
              </p>
              <p><span className="font-semibold text-gray-700">Téléphone :</span> +225 05 75 42 17 17</p>
              <p><span className="font-semibold text-gray-700">Directeur de la publication :</span> Kouassi Guy Williams, Gérant</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">2. Hébergement</h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <div>
                <p className="font-semibold text-gray-700">Frontend (interface utilisateur)</p>
                <p>Vercel Inc. — 340 Pine Street, Suite 700, San Francisco, CA 94104, États-Unis</p>
                <p><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-wikya-blue hover:underline">vercel.com</a></p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Backend (serveur API)</p>
                <p>Render Services Inc. — 525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis</p>
                <p><a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-wikya-blue hover:underline">render.com</a></p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Base de données</p>
                <p>Supabase Inc. — 970 Toa Payoh North, Singapour</p>
                <p><a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-wikya-blue hover:underline">supabase.com</a></p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Stockage des médias (photos et documents)</p>
                <p>Cloudinary Ltd. — Petah Tikva, Israël</p>
                <p><a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-wikya-blue hover:underline">cloudinary.com</a></p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">3. Propriété intellectuelle</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              L'ensemble des éléments constituant le site Wikya (textes, graphiques, logotypes, icônes, images, clips audio et vidéo)
              est la propriété exclusive de ATL Cars. Toute reproduction, représentation, modification ou exploitation, totale ou
              partielle, du contenu de ce site, par quelque procédé que ce soit, sans autorisation préalable et écrite de ATL Cars,
              est strictement interdite et constituerait une contrefaçon sanctionnée par les articles relatifs à la propriété
              intellectuelle en vigueur en Côte d'Ivoire.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">4. Limitation de responsabilité</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Wikya est une plateforme de mise en relation entre conducteurs VTC et recruteurs. ATL Cars ne peut être tenu responsable
              des relations contractuelles établies entre conducteurs et recruteurs à l'issue de cette mise en relation.
              ATL Cars s'engage à mettre tout en œuvre pour assurer l'accessibilité permanente du site, mais ne peut garantir
              une disponibilité ininterrompue de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-wikya-blue mb-4 pb-2 border-b">5. Droit applicable</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Les présentes mentions légales sont soumises au droit ivoirien. En cas de litige, les tribunaux compétents
              de la juridiction d'Abidjan seront seuls compétents.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
