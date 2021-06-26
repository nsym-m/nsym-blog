import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { getHeaderHtml } from '../lib/header'
import Link from 'next/link'
import Date from '../components/date'
import Paper from '@material-ui/core/Paper'

const PaperItem = styled(Paper)`
  margin: 0 0 1.25rem;
  padding: ${(props) => props.theme.spacing(2)}px;
`

export default function Home(
  { allPostsData,
    headerHtml
  }:
  { allPostsData: any,
    headerHtml: string
  }
  ) {
  return (
    <Layout home>
      <Head>
        <Link href="/">
          <a>
            <title>{siteTitle}</title>
          </a>
        </Link>
      </Head>
      <section className={utilStyles.headingMd}>
        <div dangerouslySetInnerHTML={{ __html: headerHtml }} />
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }: { id: string, date: string, title: string }) => (
            <PaperItem component="li" key={id} variant="outlined">
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </PaperItem>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

const allPostsData = getSortedPostsData()

export async function getStaticProps(){
  const headerHtml = await getHeaderHtml()
  return {
    props: {
      allPostsData: allPostsData,
      headerHtml: headerHtml
    }
  }
}
