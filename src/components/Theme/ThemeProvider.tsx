"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { FC } from "react";

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(){let e;const t=window.localStorage.getItem("theme");if(null!==t&&t!=="system")e=t;else{e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",e)}();`,
        }}
      />
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>{props.children}</NextThemesProvider>
    </>
  )
}

export default ThemeProvider
