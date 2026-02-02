'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { TocItem } from '../../models'
import styles from './TableOfContents.module.css'

type Props = {
  items: TocItem[]
}

export const TableOfContents: React.FC<Props> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // クライアントサイドでのみ Portal を使用するため
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // IntersectionObserver で現在の見出しを検出
  useEffect(() => {
    if (items.length === 0) return

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 可視状態の見出しを収集
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        
        if (visibleEntries.length > 0) {
          // 最も上にある見出しをアクティブに
          const topEntry = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top < current.boundingClientRect.top
              ? prev
              : current
          })
          setActiveId(topEntry.target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    headingElements.forEach((el) => observer.observe(el))

    return () => {
      headingElements.forEach((el) => observer.unobserve(el))
    }
  }, [items])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        const yOffset = -80 // ヘッダーの高さ分オフセット
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        setActiveId(id)
        setIsExpanded(false) // モバイルで目次を閉じる
      }
    },
    []
  )

  if (items.length === 0) {
    return null
  }

  const mobileFloatingToc = (
    <div className={`${styles.mobileContainer} ${isExpanded ? styles.mobileExpanded : ''}`}>
      <button
        className={styles.floatingButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="toc-list-mobile"
        aria-label="目次を開く"
      >
        <svg 
          className={styles.tocIcon} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="16" y2="12" />
          <line x1="3" y1="18" x2="12" y2="18" />
        </svg>
      </button>
      
      <nav 
        id="toc-list-mobile"
        className={styles.mobilePanel}
        aria-label="目次"
      >
        <div className={styles.mobilePanelHeader}>
          <span className={styles.mobilePanelTitle}>目次</span>
          <button 
            className={styles.closeButton}
            onClick={() => setIsExpanded(false)}
            aria-label="目次を閉じる"
          >
            ✕
          </button>
        </div>
        <ul className={styles.mobileList}>
          {items.map((item) => (
            <li
              key={item.id}
              className={`${styles.item} ${
                item.level === 3 ? styles.level3 : ''
              } ${activeId === item.id ? styles.active : ''}`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={styles.link}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      {/* デスクトップ用目次 */}
      <nav className={styles.toc} aria-label="目次">
        <div className={styles.title}>目次</div>
        <ul className={styles.list}>
          {items.map((item) => (
            <li
              key={item.id}
              className={`${styles.item} ${
                item.level === 3 ? styles.level3 : ''
              } ${activeId === item.id ? styles.active : ''}`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={styles.link}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* モバイル用フローティング目次（Portal で body 直下にレンダリング） */}
      {isMounted && createPortal(mobileFloatingToc, document.body)}
    </>
  )
}

