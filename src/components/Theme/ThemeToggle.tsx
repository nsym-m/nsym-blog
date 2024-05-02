'use client'

import Monitor from '../Icons/Monitor'
import Sun from '../Icons/Sun'
import Moon from '../Icons/Moon'
import { Check } from '../Icons/Check'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import styles from './Theme.module.css'

const ThemeToggle = (): JSX.Element => {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, themes, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="rounded border p-2 dark:border-gray-500">
        <div className="size-6"></div>
      </div>
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className={styles.button}>
        <button
          aria-label="カラーテーマを選択する"
          className={styles.button}
          type="button"
        >
          {resolvedTheme === 'light' ? (
            <Sun />
          ) : (
            <Moon />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="center"
          className={styles.group}
        >
          <DropdownMenu.Group className={styles.group+` flex flex-col`}>
            {themes.map((item) => (
              <DropdownMenu.Item
                className={styles.themeBox+` `+styles.DropdownMenuItem}
                key={item}
                onClick={() => {
                  setTheme(item)
                  let newTheme = item
                  if (item === 'system') {
                    const mql = window.matchMedia('(prefers-color-scheme: dark)')
                    newTheme =  mql.matches ? 'dark' : 'light'
                  }
                  const root = window.document.documentElement
                  root.setAttribute('data-theme', newTheme)
                }}
              >
                <span className={styles.themeIcon}>
                  {item === 'light' ? (
                    <Sun />
                  ) : item === 'system' ? (
                    <Monitor />
                  ) : (
                    <Moon />
                  )}
                  <span className={styles.themeMenu+` capitalize`}>{item}</span>
                  {item === theme && <Check></Check>}
                </span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default ThemeToggle
