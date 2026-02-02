import React from 'react'
import { getSortedArticlesData } from '../../lib/articles'
import { ArticleRoot } from '../../components/ArticleRoot/ArticleRoot'
import { Header } from '../../components/Header/Header';
import { Metadata } from 'next';
import { config } from '../../config';

export const metadata: Metadata = {
  title: `記事 | ${config.siteTitle}`,
  description: 'にしやまの技術ブログ',
  openGraph: {
    type: 'website',
    title: '記事',
    description: 'にしやまの技術ブログ',
    siteName: config.siteTitle,
    images: [`${config.siteUrl}/images/${config.image.avatar}`],
  },
  twitter: {
    card: 'summary',
    title: '記事',
    description: 'にしやまの技術ブログ',
    images: [`${config.siteUrl}/images/${config.image.avatar}`],
    creator: `@${config.social.twitter}`,
    site: `@${config.social.twitter}`,
  },
};

export default async function Home(): Promise<React.JSX.Element> {
  const articles = await getSortedArticlesData();

  return (
    <>
      <Header />
      <ArticleRoot articles={articles} />
    </>
  )
}
