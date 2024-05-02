import { config } from "../../config";
import styles from "./Header.module.css";
import Image from "next/image"
import ThemeToggle from "../Theme/ThemeToggle";
import Link from "next/link";
import { Home } from "../Icons/Home";

export const Header: React.VFC = () => {
  return (
    <div className={styles.header}>
      <Link href="/" title="nsym.dev" className={styles.headerLogo}>
        <Home></Home>
      </Link>
      <ThemeToggle />
      {/* <div className={`${styles.eyeCatchContainer}`}>
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
      </div> */}
    </div>
  );
};
