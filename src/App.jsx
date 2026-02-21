import ConducteurDetail from './pages/ConducteurDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Repertoire from './pages/Repertoire'
import ProfilConducteur from './pages/ProfilConducteur'
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
import PrivateRoute from './components/PrivateRoute'

function NotFound() {
  return (
    <div className="py-20 text-center min-h-screen bg-wikya-gray-light flex flex-col items-center justify-center">
      <div className="text-8xl font-bold text-wikya-blue mb-4">404</div>
      <h1 className="text-2xl font-semibold text-wikya-gray mb-6">Page introuvable</h1>
      <a href="/" className="btn btn-primary">Retour à l'accueil</a>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/conducteur/:id" element={<ConducteurDetail />} />
			<Route path="/" element={<Home />} />
            <Route path="/repertoire" element={<Repertoire />} />
            <Route path="/profil/:id" element={<ProfilConducteur />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
