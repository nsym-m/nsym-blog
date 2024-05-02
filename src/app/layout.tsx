import '../styles/global.css'
import { GA_TRACKING_ID } from "../lib/gtag";
import { ReactNode } from 'react'
import ThemeProvider from '../components/Theme/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <html lang="ja-JP" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
