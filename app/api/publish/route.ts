import { NextResponse } from 'next/server';
import { fetchTrendingNews } from '@/lib/news';
import { composeArticle } from '@/lib/generatePost';
import { publishToBlogger } from '@/lib/blogger';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const articles = await fetchTrendingNews();
    const post = await composeArticle(articles);

    const dryRun = process.env.BLOGGER_DRY_RUN === 'true';

    const publishedUrl = dryRun
      ? undefined
      : await publishToBlogger({
          title: post.title,
          content: post.html,
          labels: post.labels
        });

    return NextResponse.json({
      ok: true,
      message: dryRun
        ? 'Mode brouillon: l\'article a été généré mais pas publié.'
        : 'Article publié avec succès.',
      publishedUrl,
      diagnostic: {
        labels: post.labels,
        outline: post.outline,
        usedArticles: articles.slice(0, 5).map((article) => ({
          title: article.title,
          source: article.source,
          url: article.url
        }))
      }
    });
  } catch (error) {
    console.error('Publish error', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Erreur inconnue pendant la publication';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      'Endpoint de publication automatique. Envoyez une requête POST pour déclencher la rédaction.'
  });
}
