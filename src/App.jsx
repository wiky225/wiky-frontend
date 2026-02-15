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
            <Route path="/inscription-conducteur" element={<InscriptionConducteur />} />
            <Route path="/inscription-recruteur" element={<InscriptionRecruteur />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/dashboard-conducteur" element={<DashboardConducteur />} />
            <Route path="/dashboard-recruteur" element={<DashboardRecruteur />} />
            <Route path="/paiement" element={<Paiement />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
