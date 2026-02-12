import { Link } from 'react-router-dom'

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Fonctionnalité disponible après connexion backend!')
  }

  return (
    <div className="py-12 bg-wiky-gray-light min-h-screen flex items-center">
      <div className="container-custom max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-wiky-blue mb-2 text-center">Connexion</h1>
          <p className="text-wiky-gray mb-8 text-center">Accédez à votre compte Wiky</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Email</label>
              <input type="email" className="input" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wiky-gray mb-2">Mot de passe</label>
              <input type="password" className="input" required />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm text-wiky-gray">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-wiky-blue hover:text-wiky-orange">Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="btn btn-primary w-full text-lg py-4">
              Se Connecter
            </button>

            <div className="text-center text-sm text-wiky-gray">
              Pas encore de compte ?
              <div className="mt-2 space-y-2">
                <Link to="/inscription-conducteur" className="block text-wiky-blue hover:text-wiky-orange font-semibold">
                  S'inscrire comme Conducteur
                </Link>
                <Link to="/inscription-recruteur" className="block text-wiky-blue hover:text-wiky-orange font-semibold">
                  S'inscrire comme Recruteur
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
