'use client'

import React, { PropsWithChildren } from "react";
import styles from "./ContentsLayout.module.css";

type Props = PropsWithChildren<{ 
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  narrow?: boolean;
}>;

const ContentsLayout: React.FC<Props> = props => {

  const ref = React.useRef<HTMLDivElement>(null);

  const hasSidebar = !!props.sidebar;
  const hasHeader = !!props.header;
  
  // header がある場合は、サイドバーの有無に関わらず記事用レイアウトを適用
  const wrapperClass = hasHeader
    ? `${styles.wrapper} ${styles.wrapperArticle}` 
    : styles.wrapper;

  const layoutClass = hasSidebar 
    ? `${styles.layout} ${styles.withSidebar}` 
    : styles.layout;

  const contentClass = props.narrow 
    ? `${styles.contents} ${styles.narrow}` 
    : styles.contents;

  return (
    <div ref={ref} className={wrapperClass}>
      {/* ヘッダー部分（タイトル・日付など）は全幅 */}
      {props.header && (
        <div className={styles.header}>{props.header}</div>
      )}
      
      {/* 本文とサイドバーの2カラムレイアウト */}
      <div className={layoutClass}>
        <div className={contentClass}>{props.children}</div>
        {props.sidebar && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              {props.sidebar}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ContentsLayout
