import { getAllArticleIds, getArticleData } from '../../lib/articles'
import { GetStaticProps } from "next";
import Date from '../../components/Date'
import SEO from '../../components/SEO'
import ContentsLayout from '../../components/ContentsLayout'
import utilStyles from '../../styles/utils.module.css'
import { Article as IArticle, ArticleIds } from "../../models"
import { config } from '../../config'
import { TwitterSvg } from '../../components/TwitterSvg';

type Props = { article: IArticle };

const intent = 'https://twitter.com/intent/tweet/'

export default function Article({ article }: Props): JSX.Element {
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
        <a href={`${intent}?url=${config.siteUrl}/articles/${article.header.id}&title=${article.header.matterData.title}\n&via=${config.social.twitter}`} target="_blank" rel="noreferrer">
          <TwitterSvg></TwitterSvg>
        </a>
      </ContentsLayout>
    </>

  )
}

export async function getStaticPaths(): Promise<{
  paths: ArticleIds;
  fallback: boolean;
}> {
  const paths = getAllArticleIds()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props, { id: string }> = async ({
  params,
}) => {
  if (!params) throw new Error("Component file name must has params.");

  const article = await getArticleData(params.id);
  return {
    props: { article },
  };
};
