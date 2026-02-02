import { getAllArticleIds, getArticle } from '../../../lib/articles'
import Date from '../../../components/Date'
import ContentsLayout from '../../../components/ContentsLayout/ContentsLayout'
import utilStyles from '../../../styles/utils.module.css'
import { Article as IArticle, ArticleIds } from "../../../models"
import { config } from '../../../config'
import { TwitterCircle } from '../../../components/Icons/Twitter';
import Link from 'next/link';
import { Header } from '../../../components/Header/Header';
import { Metadata } from 'next';

const intent = 'https://twitter.com/intent/tweet/'

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  const title = article.header.matterData.title;
  const description = article.header.excerpt;
  const ogImageUrl = `${config.siteUrl}/og/${id}`;

  return {
    title: `${title} | ${config.siteTitle}`,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      siteName: config.siteTitle,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: `@${config.social.twitter}`,
      site: `@${config.social.twitter}`,
    },
  };
}

export default async function Article({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const article: IArticle = await getArticle(id);
  return (
    <>
      <Header />
      <ContentsLayout >
        <article>
          <h1 className={utilStyles.headingXl}>{article.header.matterData.title}</h1>
          <div className={utilStyles.lightText}>
            <span className={utilStyles.mgr10}>公開日時：<Date dateString={article.header.matterData.createdAt} /></span>
            {article.header.matterData.updatedAt && (
              <span className={utilStyles.mgr10}>更新日時：<Date dateString={article.header.matterData.updatedAt ?? ''} /></span>
            )}
          </div>
          <div className={utilStyles.article} dangerouslySetInnerHTML={{ __html: article.bodyMdText }} />
        </article>
        <div className={utilStyles.links}>
          <a href={`${intent}?url=${config.siteUrl}/articles/${article.header.id}&title=${article.header.matterData.title}\n&via=${config.social.twitter}`} target="_blank" rel="noreferrer">
            <TwitterCircle></TwitterCircle>
          </a>
          <Link href={'/articles/'} className={utilStyles.titleLink}>
            記事一覧に戻る
          </Link>
          <Link href={'/'} className={utilStyles.titleLink}>
            ホームに戻る
          </Link>
        </div>
      </ContentsLayout>
    </>

  )
}

export async function generateStaticParams(): Promise<ArticleIds> {
  return getAllArticleIds().map((article) => ({
    id: article.id
  }))
}
