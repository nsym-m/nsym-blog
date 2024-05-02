export type theme = 'dark' | 'light' | 'system'

export const themes: theme[] = ['dark', 'light', 'system']
let currentTheme: theme | null

export const theme = (): theme => {
  if (currentTheme !== null) {
    return currentTheme
  }
  if (localStorage.theme === 'dark') {
    return 'dark'
  }
  if (localStorage.theme === 'light') {
    return 'light'
  }
  return 'system'
}

export const isMatch = (theme: theme): boolean => {
  return theme === currentTheme
}

export const resolvedTheme = (): theme => {
  if (currentTheme === null || currentTheme === 'system') {
    return resolvedPrefColorScheme()
  }
  return currentTheme
}

export const setTheme = (newTheme: theme): void => {
  localStorage.setItem('theme', newTheme)
  currentTheme = newTheme
  if (newTheme === 'system') {
    newTheme = resolvedPrefColorScheme()
  }
  const root = window.document.documentElement
  root.setAttribute('data-theme', newTheme)
}

const resolvedPrefColorScheme = (): theme => {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  return mql.matches ? 'dark' : 'light'
}
