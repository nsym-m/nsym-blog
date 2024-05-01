import { GA_TRACKING_ID } from "../lib/gtag";
import { ReactNode } from 'react'
import { ThemeProvider } from "../components/Theme/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <html lang="ja-JP" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
