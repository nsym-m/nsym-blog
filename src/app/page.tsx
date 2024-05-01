import React from 'react'
import SEO from '../components/SEO'
import { AboutMe } from '../components/AboutMe/AboutMe';
import ContentsLayout from '../components/ContentsLayout/ContentsLayout';
import { ThemeToggle } from "../components/Theme/ThemeToggle";

export default function Home(): JSX.Element {
  return (
    <>
      <SEO title="プロフィール" description="にしやまの技術ブログ" />
      <ThemeToggle />
      <ContentsLayout>
        <AboutMe />
      </ContentsLayout>
    </>
  )
}
