import styles from "./Header.module.css";

type Props = { image: string };

export const Header: React.VFC<Props> = props => {
  return (
    <a href="/">
      <div className={`${styles.eyeCatchContainer}`}>
          <img className={styles.eyeCatch} src={`/images/headers/${props.image}.png`} alt="" />
      </div>
      <div className={styles.eyeCatchWrapper}>
        <div className={styles.scrollDownContainer}>
        </div>
      </div>
    </a>
  );
};
