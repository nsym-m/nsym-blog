import { GA_TRACKING_ID } from "../lib/gtag";
import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <html lang="ja-JP">
      <body>{children}</body>
    </html>
  )
}
