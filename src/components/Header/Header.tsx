import { config } from "../../config";
import styles from "./Header.module.css";
import Image from "next/image"

export const Header: React.VFC = () => {
  return (
    <div>
      <div className={`${styles.eyeCatchContainer}`}>
          <Image
            className={styles.eyeCatch}
            src={`/images/headers/${config.image.header}`}
            alt="ヘッダー画像"
            style={{
              maxWidth: "100%",
              height: "auto"
            }}></Image>
      </div>
      <div className={styles.eyeCatchWrapper}>
        <div className={styles.scrollDownContainer}>
        </div>
      </div>
    </div>
  );
};
