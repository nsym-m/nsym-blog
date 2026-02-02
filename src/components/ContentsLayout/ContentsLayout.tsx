'use client'

import React, { PropsWithChildren } from "react";
import styles from "./ContentsLayout.module.css";

type Props = PropsWithChildren<{ 
  sidemenu?: React.ReactNode;
  narrow?: boolean;
}>;

const ContentsLayout: React.FC<Props> = props => {

  const ref = React.useRef<HTMLDivElement>(null);

  const contentClass = props.narrow 
    ? `${styles.contents} ${styles.narrow}` 
    : styles.contents;

  return (
    <div ref={ref} className={styles.layout}>
      <div className={contentClass}>{props.children}</div>
    </div>
  );
};

export default ContentsLayout
