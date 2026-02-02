import styles from "./AboutMe.module.css";
import { config } from "../../config";
import Image from "next/image"

export const AboutMe: React.FC = () => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.avatar}
        src={`/images/${config.image.avatar}`}
        alt="avatar"
        width={200}
        height={200}
      />
      <h1 className={styles.name}>にしやま</h1>
      <p className={styles.bio}>
        7年目のバックエンドのプログラマーです。<br />
        最近はGoばっか書いてます。まだまだ修行中。<br />
        犬と猫を飼ってます。漫画とアニメが好きです。
      </p>
      <div className={styles.links}>
        <a href={`https://twitter.com/${config.social.twitter}`} target="_blank" className={styles.link} rel="noreferrer">
          Twitter
        </a>
        <a href={`https://github.com/${config.social.github}`} target="_blank" className={styles.link} rel="noreferrer">
          GitHub
        </a>
        <a href={`https://zenn.dev/${config.social.zenn}`} target="_blank" className={styles.link} rel="noreferrer">
          Zenn
        </a>
        <a href={`https://qiita.com/${config.social.qiita}`} target="_blank" className={styles.link} rel="noreferrer">
          Qiita
        </a>
      </div>
    </div>
  );
};
