import React from 'react'
import { GetStaticProps } from "next";
import { getSortedArticlesData } from '../lib/articles'
import SEO from '../components/SEO'
import { ArticleRoot } from '../components/ArticleRoot'
import { ArticleHeader as IArticleHeader } from "../models";

type Props = {
  articles: IArticleHeader[];
};

export default function Home({ articles }: Props): JSX.Element {
  return (
    <>
      <SEO title="TOP" description="にしやまの技術ブログ" />
      <ArticleRoot articles={articles} />
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = await getSortedArticlesData();

  return {
    props: {
      articles
    },
  };
};
