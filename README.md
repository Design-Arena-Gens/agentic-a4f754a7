# Agent Blogger Automatisé

Agent newsroom Next.js qui identifie les tendances, rédige des articles professionnels et les publie automatiquement dans Blogger.

## 📋 Description

Chaque jour à 07:00 UTC (cron Vercel), l'agent :

- interroge NewsAPI pour connaître les sujets les plus commentés en France ;
- synthétise les informations (OpenAI si disponible, sinon moteur interne) ;
- produit un article structuré avec sections, repères chiffrés et sources ;
- publie le contenu final dans Blogger via l'API officielle.

Une interface sobre (route `/`) permet de déclencher une publication manuelle ou de visualiser la configuration.

## 🚀 Installation

### Prérequis

- Node.js 18+
- Compte [NewsAPI](https://newsapi.org/)
- Blog actif sur [Blogger](https://www.blogger.com/)
- Identifiants OAuth2 Google (client, secret, refresh token)

### Étapes

```bash
npm install
cp .env.example .env.local   # renseigner toutes les variables
npm run dev
```

Ensuite, ouvrez http://localhost:3000. Pour tester sans publier, positionnez `BLOGGER_DRY_RUN=true`.

## 🔐 Variables d'environnement

| Nom                    | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `NEWS_API_KEY`         | Clé API NewsAPI                                                 |
| `BLOGGER_BLOG_ID`      | Identifiant du blog cible (numérique)                           |
| `GOOGLE_CLIENT_ID`     | Client OAuth2 Google (type web)                                 |
| `GOOGLE_CLIENT_SECRET` | Secret OAuth2                                                   |
| `GOOGLE_REFRESH_TOKEN` | Refresh token autorisant l'accès Blogger                       |
| `POST_AUTHOR_NAME`     | Signature de l'article (facultatif)                             |
| `OPENAI_API_KEY`       | Optionnel : améliore la rédaction via GPT-4.1-mini              |
| `BLOGGER_DRY_RUN`      | `true` pour générer sans publier (utile pour les tests)         |

## 📁 Structure

```
.
├── app/
│   ├── api/publish/route.ts   # Fonction serverless appelée par le cron
│   ├── layout.tsx
│   ├── page.tsx               # Interface de contrôle
│   └── globals.css
├── lib/
│   ├── blogger.ts             # Publication vers Blogger
│   ├── generatePost.ts        # Génération éditoriale
│   └── news.ts                # Récupération des tendances NewsAPI
├── vercel.json                # Planification cron (07:00 UTC)
├── package.json
└── tsconfig.json
```

## 🧪 Tests & qualité

- `npm run lint`
- `npm run build`

## 🚀 Déploiement Vercel

1. Configurer les variables d'environnement dans le dashboard Vercel.
2. Déployer :

   ```bash
   vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-a4f754a7
   ```

3. Vérifier l'URL https://agentic-a4f754a7.vercel.app.
4. Le cron défini dans `vercel.json` déclenche `/api/publish` quotidiennement.

## 🧰 Personnalisation

- Ajuster l'horaire dans `vercel.json`.
- Ajouter d'autres sources d'actualité dans `lib/news.ts`.
- Adapter la stratégie éditoriale dans `lib/generatePost.ts`.
