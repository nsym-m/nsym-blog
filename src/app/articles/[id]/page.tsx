import { getAllArticleIds, getArticle } from '../../../lib/articles'
import Date from '../../../components/Date'
import SEO from '../../../components/SEO'
import ContentsLayout from '../../../components/ContentsLayout/ContentsLayout'
import utilStyles from '../../../styles/utils.module.css'
import { Article as IArticle, ArticleIds } from "../../../models"
import { config } from '../../../config'
import { TwitterCircle } from '../../../components/Svg/TwitterSvg';
import Link from 'next/link';

const intent = 'https://twitter.com/intent/tweet/'

export const dynamicParams = false

export default async function Article({ params }: { params: { id: string } }): Promise<JSX.Element> {

  const article: IArticle = await getArticle(params.id);
  return (
    <>
      <SEO title={article.header.matterData.title} description={article.header.excerpt} />
      <ContentsLayout >
        <article>
          <h1 className={utilStyles.headingXl}>{article.header.matterData.title}</h1>
          <div className={utilStyles.lightText}>
            <span className={utilStyles.mgr10}>公開日時：<Date dateString={article.header.matterData.createdAt} /></span>
            {article.header.matterData.updatedAt && (
              <span className={utilStyles.mgr10}>更新日時：<Date dateString={article.header.matterData.updatedAt??''} /></span>
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

export async function generateStaticParams(): Promise<ArticleIds>{
  return getAllArticleIds().map((article) => ({
    id: article.id
  }))
}
