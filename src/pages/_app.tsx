import React, { useEffect } from 'react'

import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import {
  ThemeProvider as MaterialUIThemeProvider,
  StylesProvider
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import theme from '../styles/theme'
import { useGoogleAnalytics } from "../lib/gtag";


const MyApp = ({ Component, pageProps }: {Component: any, pageProps: any}): JSX.Element => {
  // Remove the server-side injected CSS.(https://material-ui.com/guides/server-rendering/)
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])
  useGoogleAnalytics();

  // return (
  //   <ThemeProvider>
  //     <Layout>
  //       <Component {...pageProps} />
  //     </Layout>
  //   </ThemeProvider>
  // );

  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <Component {...pageProps} />
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  )
}

export default MyApp
