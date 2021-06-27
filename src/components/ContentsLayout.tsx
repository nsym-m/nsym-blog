import React from "react";
import classnames from "classnames";
import { AboutMe } from "./AboutMe";
import styles from "./ContentsLayout.module.css";

type Props = { sidemenu?: React.ReactNode };

const ContentsLayout: React.FC<Props> = props => {
  const [sidemenuOpen, setSidemenuOpen] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={styles.layout}>
      <div className={styles.contents}>{props.children}</div>
      <div
        className={classnames(
          styles.sidemenuContainer,
          sidemenuOpen && styles.sidemenuOpen,
        )}>
        <div className={styles.sidemenu}>
          <div className={styles.aboutme}>
            <AboutMe />
          </div>
          <div className={styles.otherMenu}>{props.sidemenu}</div>
        </div>
      </div>
      {/* <button
        className={classnames(
          styles.sidemenuOpenButton,
          isInViewport && styles.showSidemenuOpenButton,
        )}
        onClick={() => setSidemenuOpen(prev => !prev)}>
        <BarsIcon className={styles.menuIcon} />
      </button> */}
    </div>
  );
};

export default ContentsLayout
