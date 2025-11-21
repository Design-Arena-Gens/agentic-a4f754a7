"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type PublishResponse = {
  ok: boolean;
  message: string;
  publishedUrl?: string;
};

async function triggerPublish(): Promise<PublishResponse> {
  const response = await fetch('/api/publish', {
    method: 'POST'
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail?.message ?? 'Erreur inconnue');
  }

  return response.json();
}

export default function Home() {
  const [status, setStatus] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [lastPublish, setLastPublish] = useState<PublishResponse | null>(null);

  const onPublish = async () => {
    setIsPending(true);
    setStatus('Publication en cours…');
    try {
      const result = await triggerPublish();
      setLastPublish(result);
      setStatus(
        result.publishedUrl
          ? `Article publié: ${result.publishedUrl}`
          : result.message
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Impossible de publier'
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main>
      <span className="badge">Rédaction automatisée</span>
      <h1>Agent newsroom pour Blogger</h1>
      <p>
        Cet agent suit les sujets tendances, synthétise les informations clés et
        publie automatiquement un article quotidien dans votre blog Blogger. Il
        crée un angle éditorial professionnel, ajoute un contexte riche et cite
        les sources les plus crédibles.
      </p>

      <section>
        <div className="card-grid">
          <div className="card">
            <h3>Pipeline éditorial</h3>
            <p>
              1. Récupération des dernières actualités tendances depuis NewsAPI.
              2. Classifie et consolide les sujets pertinents. 3. Génère un
              article structuré avec chapeau & analyses. 4. Programme la
              publication quotidienne sur Blogger.
            </p>
          </div>

          <div className="card">
            <h3>Publication automatique</h3>
            <p>
              La fonction serverless <code className="inline-code">
                /api/publish
              </code>{' '}
              est appel&eacute;e quotidiennement via Vercel Cron. Vous pouvez
              aussi lancer une publication instantan&eacute;e ci-dessous.
            </p>
          </div>

          <div className="card">
            <h3>Configuration requise</h3>
            <ul>
              <li>NEWS_API_KEY : clé API de NewsAPI</li>
              <li>BLOGGER_BLOG_ID : identifiant du blog</li>
              <li>GOOGLE_CLIENT_ID / SECRET / REFRESH_TOKEN</li>
              <li>POST_AUTHOR_NAME : signature de l&apos;article</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Déclencher une publication</h2>
        <p>
          Cliquez pour produire un article dès maintenant. Les articles quotidiens
          sont publiés autour de 07:00 UTC.
        </p>
        <button className="cta" onClick={onPublish} disabled={isPending}>
          {isPending ? 'Génération en cours…' : 'Publier un article maintenant'}
        </button>
        {status && (
          <p className="status">
            <strong>Statut :</strong> {status}
          </p>
        )}
        {lastPublish?.publishedUrl && (
          <p className="status">
            <strong>URL :</strong>{' '}
            <a
              href={lastPublish.publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lastPublish.publishedUrl}
            </a>
          </p>
        )}
        <p className="status">
          <strong>Dernière exécution :</strong>{' '}
          {format(new Date(), 'PPPpp', { locale: fr })}
        </p>
      </section>

      <section>
        <h2>Variables d&apos;environnement</h2>
        <div className="grid-two">
          <div>
            <p className="monospace">
              NEWS_API_KEY=
              <span style={{ opacity: 0.6 }}>votre_cle_newsapi</span>
            </p>
            <p className="monospace">
              BLOGGER_BLOG_ID=
              <span style={{ opacity: 0.6 }}>1234567890123456789</span>
            </p>
            <p className="monospace">
              GOOGLE_CLIENT_ID=
              <span style={{ opacity: 0.6 }}>xxx.apps.googleusercontent.com</span>
            </p>
          </div>
          <div>
            <p className="monospace">
              GOOGLE_CLIENT_SECRET=
              <span style={{ opacity: 0.6 }}>google_client_secret</span>
            </p>
            <p className="monospace">
              GOOGLE_REFRESH_TOKEN=
              <span style={{ opacity: 0.6 }}>refresh_token</span>
            </p>
            <p className="monospace">
              POST_AUTHOR_NAME=<span style={{ opacity: 0.6 }}>Nom Auteur</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
