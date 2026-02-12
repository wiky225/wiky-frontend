# 🚗 WIKY FRONTEND - Guide d'Installation

**Plateforme VTC Côte d'Ivoire - Interface React**

---

## 📦 CONTENU DU PACKAGE

Ce dossier contient le **frontend complet** de Wiky :
- ✅ 10 pages React complètes
- ✅ Composants réutilisables (Header, Footer)
- ✅ Design responsive mobile/desktop
- ✅ Couleurs Wiky configurées (#253b56 + #ed6d1d)
- ✅ Navigation React Router
- ✅ Configuration Tailwind CSS

---

## 🚀 INSTALLATION ET LANCEMENT LOCAL

### ÉTAPE 1 : Installer les dépendances

Ouvrez un terminal dans ce dossier et tapez :

```bash
npm install
```

⏳ **Attendez 2-3 minutes** que toutes les dépendances se téléchargent.

---

### ÉTAPE 2 : Configurer les variables d'environnement

**1. Copiez le fichier `.env.example` :**
```bash
copy .env.example .env
```
(Sur Mac/Linux : `cp .env.example .env`)

**2. Le fichier `.env` est déjà pré-rempli avec vos clés !**  
Vous n'avez rien à modifier pour l'instant.

---

### ÉTAPE 3 : Lancer en mode développement

```bash
npm run dev
```

**Résultat attendu :**
```
  VITE v5.0.8  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

### ÉTAPE 4 : Tester Wiky

**Ouvrez votre navigateur et allez sur :**
```
http://localhost:3000
```

✅ **Vous devriez voir la page d'accueil de Wiky !**

**Testez la navigation :**
- Page d'accueil : http://localhost:3000/
- Répertoire : http://localhost:3000/repertoire
- Inscription conducteur : http://localhost:3000/inscription-conducteur
- Inscription recruteur : http://localhost:3000/inscription-recruteur
- Connexion : http://localhost:3000/connexion

---

## 📤 DÉPLOIEMENT SUR VERCEL

### MÉTHODE 1 : Via GitHub (Recommandée)

**1. Initialisez Git dans ce dossier :**
```bash
git init
git add .
git commit -m "Initial commit - Wiky Frontend"
```

**2. Créez un repository sur GitHub :**
- Allez sur https://github.com/wiky225
- Cliquez sur "New repository"
- Nom : `wiky-frontend`
- Laissez "Public"
- **NE cochez PAS** "Initialize with README"
- Cliquez "Create repository"

**3. Liez votre dossier local au repository GitHub :**

Copiez les commandes affichées par GitHub (section "push an existing repository") :

```bash
git remote add origin https://github.com/wiky225/wiky-frontend.git
git branch -M main
git push -u origin main
```

**4. Connectez Vercel à GitHub :**
- Allez sur https://vercel.com/
- Cliquez sur "Add New" → "Project"
- Sélectionnez votre repository `wiky-frontend`
- Cliquez "Import"

**5. Configuration Vercel :**
- **Framework Preset** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

**6. Variables d'environnement :**

Cliquez sur "Environment Variables" et ajoutez :

```
VITE_SUPABASE_URL = https://kucouukkfyfgwstvoxef.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_C7FvTXUdyc6oYltmoAia9g_uo7OruGV
VITE_CLOUDINARY_CLOUD_NAME = dsulkiylf
VITE_CLOUDINARY_API_KEY = 363144589998167
VITE_API_URL = https://votre-backend.onrender.com
```

*Note : L'API_URL sera configurée après le déploiement du backend*

**7. Cliquez sur "Deploy" !**

⏳ **Attendez 2-3 minutes...**

✅ **Votre site Wiky est en ligne !**

**URL :** `https://wiky-frontend-xxxx.vercel.app`

---

### MÉTHODE 2 : Déploiement Direct (Sans GitHub)

**1. Installez Vercel CLI :**
```bash
npm install -g vercel
```

**2. Déployez :**
```bash
vercel
```

Suivez les instructions :
- Link to existing project ? **NO**
- Project name ? **wiky-frontend**
- Directory ? **.**  (point)
- Want to override settings ? **NO**

✅ **Votre site est déployé !**

---

## 🎨 PERSONNALISATION

### Couleurs

Les couleurs Wiky sont dans `tailwind.config.js` :
- Bleu principal : `#253b56`
- Orange : `#ed6d1d`
- Gris : `#3A3A3A`

### Logo

Le logo temporaire (emoji 🚗) se trouve dans `src/components/Header.jsx`.  
Pour le remplacer par le vrai logo :
1. Placez votre fichier `logo-wiky.png` dans `src/assets/`
2. Modifiez `Header.jsx` ligne 13-15

---

## 📁 STRUCTURE DU PROJET

```
wiky-frontend/
├── index.html              # Page HTML principale
├── package.json            # Dépendances npm
├── vite.config.js          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── .env.example            # Template variables env
├── .gitignore              # Fichiers à ignorer
├── README.md               # Ce fichier
└── src/
    ├── main.jsx            # Point d'entrée React
    ├── App.jsx             # Application principale
    ├── index.css           # Styles globaux
    ├── components/         # Composants réutilisables
    │   ├── Header.jsx
    │   └── Footer.jsx
    └── pages/              # Pages de l'application
        ├── Home.jsx
        ├── Repertoire.jsx
        ├── ProfilConducteur.jsx
        ├── InscriptionConducteur.jsx
        ├── InscriptionRecruteur.jsx
        ├── Login.jsx
        ├── DashboardConducteur.jsx
        ├── DashboardRecruteur.jsx
        └── Paiement.jsx
```

---

## ❓ PROBLÈMES FRÉQUENTS

### "npm: command not found"
→ Node.js n'est pas installé. Vérifiez avec `node --version`

### "Port 3000 already in use"
→ Un autre programme utilise le port 3000. Fermez-le ou changez le port dans `vite.config.js`

### "Module not found"
→ Lancez `npm install` à nouveau

### Le site est blanc
→ Vérifiez la console du navigateur (F12) pour voir les erreurs

---

## 🔄 PROCHAINES ÉTAPES

**✅ Frontend déployé !**

**Maintenant :**
1. ⏳ Configuration de la base de données Supabase
2. ⏳ Déploiement du backend sur Render
3. ⏳ Connexion Frontend ↔ Backend
4. ⏳ Tests complets

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez un problème :
1. Vérifiez ce README
2. Consultez la console du terminal
3. Regardez la console du navigateur (F12)
4. Contactez-moi avec le message d'erreur exact

---

**🎉 Félicitations ! Le frontend Wiky est prêt !**

**Wiky by ATL Cars** - Développé avec ❤️
