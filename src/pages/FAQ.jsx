import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SECTIONS = [
  {
    titre: 'Général',
    questions: [
      {
        q: "Qu'est-ce que Wikya ?",
        r: "Wikya est la plateforme de référence pour la mise en relation entre conducteurs VTC et recruteurs en Côte d'Ivoire. Conducteurs : créez votre profil gratuit et soyez visible par des centaines de recruteurs. Recruteurs : accédez au répertoire des conducteurs certifiés et déposez vos offres d'emploi.",
      },
      {
        q: "Wikya est-il gratuit ?",
        r: "L'inscription est totalement gratuite pour les conducteurs. Un abonnement optionnel à 1 000 FCFA pour 2 mois permet aux conducteurs de contacter les recruteurs directement. Pour les recruteurs, l'accès aux coordonnées complètes des conducteurs nécessite un abonnement à 10 000 FCFA/mois.",
      },
      {
        q: "Comment contacter l'équipe Wikya ?",
        r: "Vous pouvez nous joindre par WhatsApp au +225 05 75 42 17 17 (disponible 24h/24) ou par email à contact@wikya.ci.",
      },
    ],
  },
  {
    titre: 'Conducteurs',
    questions: [
      {
        q: "Comment créer mon profil conducteur ?",
        r: "Rendez-vous sur la page « S'inscrire » et choisissez « Conducteur ». Renseignez vos informations (nom, téléphone, commune, expérience, photo, permis…). Une fois votre profil validé, il apparaît dans le répertoire et est visible par les recruteurs.",
      },
      {
        q: "Mon profil est-il visible immédiatement après inscription ?",
        r: "Oui, dès que vous finalisez votre profil (avec photo et permis de conduire), il est visible dans le répertoire. Les visiteurs voient vos initiales et votre commune ; les recruteurs abonnés voient vos coordonnées complètes.",
      },
      {
        q: "À quoi sert l'abonnement conducteur ?",
        r: "L'abonnement conducteur (1 000 FCFA / 2 mois) vous permet de consulter les offres de recrutement en détail et d'envoyer des messages directement aux recruteurs via WhatsApp.",
      },
      {
        q: "Comment payer mon abonnement ?",
        r: "Le paiement s'effectue via Wave, le service de paiement mobile disponible en Côte d'Ivoire. Rendez-vous sur la page « Paiement » depuis votre tableau de bord et suivez les instructions.",
      },
      {
        q: "Comment modifier mon profil ?",
        r: "Connectez-vous à votre espace depuis la page « Connexion », puis accédez à votre tableau de bord. Vous pouvez y modifier vos informations, changer votre photo et mettre à jour votre permis de conduire.",
      },
      {
        q: "J'ai oublié mon mot de passe, que faire ?",
        r: "Sur la page de connexion, cliquez sur « Mot de passe oublié ». Saisissez votre email et vous recevrez un lien de réinitialisation dans votre boîte mail (vérifiez également vos spams).",
      },
    ],
  },
  {
    titre: 'Recruteurs',
    questions: [
      {
        q: "Comment créer un compte recruteur ?",
        r: "Rendez-vous sur la page « S'inscrire » et choisissez « Recruteur ». Renseignez les informations de votre entreprise ou vos informations personnelles si vous êtes un particulier, puis validez votre compte.",
      },
      {
        q: "Comment voir les coordonnées complètes des conducteurs ?",
        r: "Les coordonnées complètes (email, téléphone, permis) sont accessibles avec un abonnement recruteur à 10 000 FCFA/mois, payable via Wave. Sans abonnement, vous voyez uniquement les initiales et la commune du conducteur.",
      },
      {
        q: "Comment déposer une offre de recrutement ?",
        r: "Depuis votre tableau de bord recruteur, accédez à la section « Mes offres » et cliquez sur « Créer une offre ». Précisez les types de véhicules proposés, la recette journalière, les horaires et le type de contrat.",
      },
      {
        q: "Comment un conducteur me contacte-t-il ?",
        r: "Les conducteurs abonnés peuvent vous envoyer un message depuis la page des offres. Ce message vous est transmis directement sur votre WhatsApp enregistré.",
      },
      {
        q: "Puis-je ajouter des conducteurs en favoris ?",
        r: "Oui, depuis le profil d'un conducteur ou le répertoire, vous pouvez ajouter des conducteurs à vos favoris pour les retrouver facilement dans votre tableau de bord.",
      },
    ],
  },
  {
    titre: 'Compte & connexion',
    questions: [
      {
        q: "Je ne reçois pas l'email de confirmation",
        r: "Vérifiez votre dossier spam ou courrier indésirable. L'email est envoyé depuis noreply@wikya.ci. Si vous ne le trouvez pas après quelques minutes, contactez-nous sur WhatsApp pour que nous activions votre compte manuellement.",
      },
      {
        q: "Puis-je changer mon adresse email ?",
        r: "Pour toute modification d'email, contactez notre équipe sur WhatsApp au +225 05 75 42 17 17 ou par email à contact@wikya.ci.",
      },
      {
        q: "Comment supprimer mon compte ?",
        r: "Pour supprimer votre compte et vos données, envoyez une demande à contact@wikya.ci en précisant votre email d'inscription. Votre demande sera traitée sous 7 jours ouvrables, conformément à notre politique de confidentialité.",
      },
    ],
  },
];

function ItemFAQ({ question, reponse }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-medium text-gray-800 text-sm leading-snug">{question}</span>
        <span className={`shrink-0 text-wikya-blue transition-transform duration-200 ${ouvert ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {ouvert && (
        <p className="pb-4 text-sm text-gray-600 leading-relaxed">{reponse}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Helmet>
        <title>FAQ — Questions fréquentes | Wikya Côte d'Ivoire</title>
        <meta name="description" content="Retrouvez les réponses aux questions fréquentes sur Wikya : inscription, abonnement, offres de recrutement, paiement Wave, et plus encore." />
        <meta property="og:title" content="FAQ Wikya — Questions fréquentes" />
        <meta property="og:description" content="Toutes les réponses sur Wikya : inscription, abonnement, offres de recrutement, paiement Wave." />
        <meta property="og:image" content="https://wikya.ci/assets/wikya-logo-new.png" />
        <meta property="og:url" content="https://wikya.ci/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wikya" />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-wikya-blue mb-2">Questions fréquentes</h1>
          <p className="text-gray-500">Tout ce que vous devez savoir sur Wikya.</p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.titre} className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-base font-bold text-wikya-orange uppercase tracking-widest mb-4">
                {section.titre}
              </h2>
              <div>
                {section.questions.map((item) => (
                  <ItemFAQ key={item.q} question={item.q} reponse={item.r} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA contact */}
        <div className="mt-10 bg-wikya-blue text-white rounded-2xl p-8 text-center">
          <p className="font-semibold text-lg mb-1">Vous n'avez pas trouvé votre réponse ?</p>
          <p className="text-sm opacity-80 mb-5">Notre équipe est disponible 24h/24 sur WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/2250575421717"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 transition-colors text-white font-semibold px-6 py-3 rounded-xl text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                <path fill="#fff" d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z"/>
                <path fill="#25D366" d="M24 6c-9.9 0-18 8.1-18 18 0 3.3.9 6.5 2.6 9.3l.4.7-1.7 6.2 6.4-1.7.7.4C16.9 40.6 20.4 42 24 42c9.9 0 18-8.1 18-18S33.9 6 24 6z"/>
                <path fill="#fff" d="M35.2 31.2c-.5 1.3-2.5 2.5-3.5 2.6-.9.1-2.1.1-3.4-.2-1.3-.3-3-.9-5.2-1.9-4.5-2-7.3-6.7-7.6-7-.2-.3-1.9-2.5-1.9-4.8s1.2-3.4 1.6-3.9c.4-.4.9-.6 1.2-.6h.9c.3 0 .6.1.9.8.3.8 1.2 2.9 1.3 3.1.1.2.2.5.1.8-.1.3-.2.5-.4.7-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.5 1.3 2.7 1.8 3.1 2 .4.2.6.1.9-.1.2-.2.9-1 1.2-1.4.2-.4.5-.3.9-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.1.1.8-.4 2.1z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:contact@wikya.ci"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold px-6 py-3 rounded-xl text-sm"
            >
              📧 contact@wikya.ci
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          <Link to="/" className="text-wikya-blue hover:underline">← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}
