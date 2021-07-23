import "../styles/globals.css"
import React from 'react'
import { useGoogleAnalytics } from "../lib/gtag";
import Layout from '../components/Layout'

const MyApp = ({ Component, pageProps }: {Component: any, pageProps: any}): JSX.Element => {
  useGoogleAnalytics();

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

}

export default MyApp
