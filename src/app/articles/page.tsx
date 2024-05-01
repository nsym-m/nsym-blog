import React from 'react'
import { getSortedArticlesData } from '../../lib/articles'
import SEO from '../../components/SEO'
import { ArticleRoot } from '../../components/ArticleRoot/ArticleRoot'

export default async function Home(): Promise<JSX.Element> {
  const articles = await getSortedArticlesData();

  return (
    <>
      <SEO title="記事" description="にしやまの技術ブログ" />
      <ArticleRoot articles={articles} />
    </>
  )
}
