import styles from "./AboutMe.module.css";
import { config } from "../config";
import { TwitterSvg } from "./TwitterSvg";
import { GitHubSvg } from "./GitHubSvg";
import { ZennSvg } from "./ZennSVG";

const social = config.social;

export const AboutMe: React.VFC = () => {
  return (
    <div>
      <div className={styles.avatarDiv}>
        <img className={styles.avatar} src="/images/profile.jpg" alt="avatar" />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.aboutme}>
          <div className={styles.biography}>
            <p>にしやま</p>
            <p>
              犬と猫を飼ってるソフトウェアエンジニア<br></br>
              業務で Go / PHP、趣味で Flutter / Swift / TypeScript などを触ります。
            </p>
            <p>
              読んだ本の感想や勉強したことなどを書いていく予定です。<br></br>
              プログラムなどの技術的なことはZennの方に書いていく予定です。
            </p>
            <div className={styles.social}>
              <a href={`https://twitter.com/${social.twitter}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                <TwitterSvg></TwitterSvg>
              </a>
              <a href={`https://github.com/${social.github}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                <GitHubSvg></GitHubSvg>
              </a>
              <a href={`https://zenn.dev/${social.zenn}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                <ZennSvg></ZennSvg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
