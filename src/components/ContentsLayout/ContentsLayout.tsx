'use client'

import React from "react";
import styles from "./ContentsLayout.module.css";

type Props = { sidemenu?: React.ReactNode };

const ContentsLayout: React.FC<Props> = props => {

  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={styles.layout}>
      <div className={styles.contents}>{props.children}</div>
    </div>
  );
};

export default ContentsLayout
