import Link from "next/link";
import { config } from "../../config";
import styles from "./Header.module.css";


export const Header: React.VFC = () => {
  return (
    <div>
      <div className={`${styles.eyeCatchContainer}`}>
          <img className={styles.eyeCatch} src={`/images/headers/${config.image.header}`} alt="" />
      </div>
      <div className={styles.eyeCatchWrapper}>
        <div className={styles.scrollDownContainer}>
        </div>
      </div>
    </div>
  );
};
