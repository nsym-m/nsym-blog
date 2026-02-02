import React from 'react'
import { AboutMe } from '../components/AboutMe/AboutMe';
import { Header } from '../components/Header/Header';
import ContentsLayout from '../components/ContentsLayout/ContentsLayout';
import { Metadata } from 'next';
import { config } from '../config';

export const metadata: Metadata = {
  title: `プロフィール | ${config.siteTitle}`,
  description: 'にしやまの技術ブログ',
  openGraph: {
    type: 'website',
    title: 'プロフィール',
    description: 'にしやまの技術ブログ',
    siteName: config.siteTitle,
    images: [`${config.siteUrl}/images/${config.image.avatar}`],
  },
  twitter: {
    card: 'summary',
    title: 'プロフィール',
    description: 'にしやまの技術ブログ',
    images: [`${config.siteUrl}/images/${config.image.avatar}`],
    creator: `@${config.social.twitter}`,
    site: `@${config.social.twitter}`,
  },
};

export default function Home(): React.JSX.Element {
  return (
    <>
      <Header />
      <ContentsLayout>
        <AboutMe />
      </ContentsLayout>
    </>
  )
}
