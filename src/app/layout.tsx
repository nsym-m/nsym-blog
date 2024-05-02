import { GA_TRACKING_ID } from "../lib/gtag";
import { ReactNode } from 'react'
import { ThemeProvider } from "next-themes";
import { Header } from '../components/Header/Header';

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <html lang="ja-JP" suppressHydrationWarning>
      <body>
      <Header />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
