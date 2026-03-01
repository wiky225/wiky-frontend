import ConducteurDetail from './pages/ConducteurDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Repertoire from './pages/Repertoire'
import InscriptionConducteur from './pages/InscriptionConducteur'
import InscriptionRecruteur from './pages/InscriptionRecruteur'
import Login from './pages/Login'
import DashboardConducteur from './pages/DashboardConducteur'
import DashboardRecruteur from './pages/DashboardRecruteur'
import Paiement from './pages/Paiement'
import Inscription from './pages/Inscription'
import Finalisation from './pages/Finalisation'
import DashboardAdmin from './pages/DashboardAdmin'
import Offres from './pages/Offres'
import AuthConfirm from './pages/AuthConfirm'
import MotDePasseOublie from './pages/MotDePasseOublie'
import ResetPassword from './pages/ResetPassword'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import ConditionsGenerales from './pages/ConditionsGenerales'
import FAQ from './pages/FAQ'
import PrivateRoute from './components/PrivateRoute'

function NotFound() {
  return (
    <div className="min-h-screen bg-wikya-gray-light flex flex-col items-center justify-center py-20 px-4">
      <div className="text-9xl font-extrabold text-wikya-blue opacity-10 select-none leading-none">404</div>
      <div className="-mt-8 text-center">
        <h1 className="text-3xl font-bold text-wikya-blue mb-3">Page introuvable</h1>
        <p className="text-wikya-gray mb-8 max-w-sm">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/" className="btn btn-primary">Retour à l'accueil</a>
          <a href="/repertoire" className="btn btn-secondary">Voir les conducteurs</a>
          <a href="/offres" className="btn btn-outline">Voir les offres</a>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/conducteur/:id" element={<ConducteurDetail />} />
			<Route path="/" element={<Home />} />
            <Route path="/repertoire" element={<Repertoire />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/inscription-conducteur" element={<InscriptionConducteur />} />
            <Route path="/inscription-recruteur" element={<InscriptionRecruteur />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/dashboard-conducteur" element={<PrivateRoute><DashboardConducteur /></PrivateRoute>} />
            <Route path="/dashboard-recruteur" element={<PrivateRoute><DashboardRecruteur /></PrivateRoute>} />
            <Route path="/paiement" element={<Paiement />} />
            <Route path="/offres" element={<Offres />} />
            <Route path="/finaliser/:token" element={<Finalisation />} />
            <Route path="/dashboard-admin" element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/conditions-generales" element={<ConditionsGenerales />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </HelmetProvider>
  )
}

export default App
