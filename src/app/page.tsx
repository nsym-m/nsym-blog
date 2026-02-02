import React from 'react'
import { AboutMe } from '../components/AboutMe/AboutMe';
import { Header } from '../components/Header/Header';
import ContentsLayout from '../components/ContentsLayout/ContentsLayout';
import { Metadata } from 'next';
import { config } from '../config';
import { getSortedArticlesData } from '../lib/articles';
import { ArticleList } from '../components/ArticleList/ArticleList';

export const metadata: Metadata = {
  title: `${config.siteTitle}`,
  description: 'にしやまの技術ブログ',
  openGraph: {
    type: 'website',
    title: config.siteTitle,
    description: 'にしやまの技術ブログ',
    siteName: config.siteTitle,
    images: [`${config.siteUrl}/images/${config.image.avatar}`],
  },
  twitter: {
    card: 'summary',
    title: config.siteTitle,
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
      <ContentsLayout>
        <AboutMe />
        <ArticleList articles={articles} />
      </ContentsLayout>
    </>
  )
}
