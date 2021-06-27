import Layout from '../../components/Layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
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

export default function Post({ article }: Props) {
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
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }: { params: any }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
