import React from 'react'
import SEO from '../components/SEO'
import { AboutMe } from '../components/AboutMe/AboutMe';
import ContentsLayout from '../components/ContentsLayout/ContentsLayout';

export default function Home(): JSX.Element {
  return (
    <>
      <SEO title="TOP" description="にしやまの技術ブログ" />
      <ContentsLayout>
        <AboutMe />
      </ContentsLayout>
    </>
  )
}
