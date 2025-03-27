# 📌 Application Mflix

ce projet est codé en Next.js et utilise une base de données Mongodb. Il est déployé sur Vercel.

## 🚀 Stack technique

- **Frontend:** Next.js
- **Backend:** Node.js, MongoDB
- **Base de données :** MongoDB Atlas
- **Déploiement:** Vercel
- **Documentation API:** Swagger

## 📂 Structure du projet

```
/Racine du projet
│-- /pages/api       # Routes API
│-- /lib             # Fonctions utilitaires
│-- /public          # Resources statiques
│-- /components      # Composants React
│-- .env.local       # Variables d'environnement
│-- README.md        # Documentation du projet
```

## 📌 Installation

1. Installation de NPM:

2. Création du projet:

   ```bash
   npx create-next-app --example with-mongodb with-mongodb-app
   ```


3. Installer et lancer le projet:

   ```bash
    npm install && npm run dev
   ```

## 📌 Configuration de MongoDb Atlas

1. Création d'un cluster partagé (gratuit, 512Mb stockage)

2. Génerer les databases/collections grâce à la fonctionnalité Atlas (Dataset “sample_mflix”).

3. Autoriser les adresses IP pour la connexion depuis la couche applicative (Network Access).

## 📌 Liaison entre l'application et la base de données

   On renomme le`.env.local.local` en `.env.local` et on ajoute:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<db-name>-<db-adress>/?retryWrites=true&w=majority
   ```

## ▶️ Lancer le projet

### En local

```bash
npm run dev
```

lien en local: [http://localhost:3000](http://localhost:3000)

## 📡 Documentation API (Swagger)

Le projet contient une documentation Swagger.

### Accès à Swagger UI

Pour cela il faut se rendre sur :

```
http://localhost:3000/api/docs
```

### Accès à Swagger UI

Le projet contient plusieurs routes :

## 📬 Les routes

### 🎥 Movies
- `GET /api/movies` - Récupère tous les films
- `GET /api/movies/:id` - Récupère un film spécifique
- `POST /api/movies` - Ajoute un nouveau film
- `PUT /api/movies/:id` - Modifie un film
- `DELETE /api/movies/:id` - Supprime un film

### 🎭 Theaters
- `GET /api/theaters` - Récupère tous les cinémas et ou théâtres
- `GET /api/theaters/:id` - Récupère un cinéma / théâtre 
- `PUT /api/theaters/:id` - Modifie un cinéma / théâtre 
- `DELETE /api/theaters/:id` - Supprime un cinéma / théâtre 

### 💬 Comments
- `GET /api/comments` - Récupère tous les commentaires
- `POST /api/comments` - Ajoutes un commentaire
- `GET /api/comments/:id` - Récupère un commentaire spécifique
- `PUT /api/comments/:id` - Modifie un commentaire
- `DELETE /api/comments/:id` - Supprime un commentaire

## 🛠️ En cas de problème

- **Connexion à la base de données MongoDb:** vérifié le `MONGODB_URI` dans `.env.local`.
- **Si l'API ne fonctionne pas** Verifier qu'on est bien connecter sur le réseau
- **En cas de problème de déploiement?** S'assurer que les variables sont correctes sur Vercel

## 🚀 Deployer sur Vercel

1. Push son code sur GitHub.
2. Aller sur [Vercel](https://vercel.com/) en se connectant avec son compte github
3. Modifier son environnement local sur vercel pour être cohérent avec `.env.local`.
4. Déployer et aller sur l'url!


