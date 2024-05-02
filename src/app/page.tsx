import React from 'react'
import SEO from '../components/SEO'
import { AboutMe } from '../components/AboutMe/AboutMe';
import {Header} from '../components/Header/Header';
import ContentsLayout from '../components/ContentsLayout/ContentsLayout';

export default function Home(): JSX.Element {
  return (
    <>
    <Header />
      <SEO title="プロフィール" description="にしやまの技術ブログ" />
      <ContentsLayout>
        <AboutMe />
      </ContentsLayout>
    </>
  )
}
