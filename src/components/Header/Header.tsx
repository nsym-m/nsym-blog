import Link from "next/link";
import { config } from "../../config";
import styles from "./Header.module.css";


export const Header: React.VFC = () => {
  return (
    <Link href="/">
      <a>
      <div className={`${styles.eyeCatchContainer}`}>
          <img className={styles.eyeCatch} src={`/images/headers/${config.header}`} alt="" />
      </div>
      <div className={styles.eyeCatchWrapper}>
        <div className={styles.scrollDownContainer}>
        </div>
      </div>
    </a>
    </Link>
  );
};
