import Layout from '../../components/Layout'
import { getAllArticleIds, getArticleData } from '../../lib/articles'
import { GetStaticProps, GetStaticPaths } from "next";
import Head from 'next/head'
import Date from '../../components/date'
import SEO from '../../components/SEO'
import ContentsLayout from '../../components/ContentsLayout'
import utilStyles from '../../styles/utils.module.css'
import "highlight.js/styles/dark.css";
import { Article as IArticle } from "../../models";

// TODO: 記事の目次を横に表示させる(toc)
// TODO: コードのシンタックスハイライトがうまく効いていないので調整する
// TODO: 文字フォント変更
// TODO: 記事の横幅を広げる
// TODO: ヘッダー画像の設定
// TODO: 時間の表記を日本に変更
// TODO: 型周りでエラーが出てる

type Props = { article: IArticle };

export default function Article({ article }: Props) {
  return (
    <>
      <SEO title={article.header.matterData.title} description={article.header.excerpt} />
      <ContentsLayout >
        <article>
          <h1 className={utilStyles.headingXl}>{article.header.matterData.title}</h1>
          <div className={utilStyles.lightText}>
            {/* <Date dateString={article.date} /> */}
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.bodyMdText }} />
        </article>
      </ContentsLayout>
    </>
  )
}

export async function getStaticPaths() {
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
