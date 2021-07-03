import styles from "./Header.module.css";

export const Header: React.VFC = props => {
  return (
    <>
      <div className={styles.eyeCatchContainer}>
        <img className={styles.eyeCatch} src="/images/headers/header.jpg" alt="" />
      </div>
      <div className={styles.eyeCatchWrapper}>
        <div className={styles.scrollDownContainer}>
          {/* <div className={styles.scrollDown}>Scroll down</div> */}
        </div>
      </div>
    </>
  );
};
