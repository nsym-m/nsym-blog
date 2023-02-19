import styles from "./AboutMe.module.css";
import { config } from "../../config";
import { TwitterSvg } from "../Svg/TwitterSvg";
import { GitHubSvg } from "../Svg/GitHubSvg";
import { ZennSvg } from "../Svg/ZennSvg";
import Link from "next/link";
import { BlogSvg } from "../Svg/BlogSvg";

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
              業務でGo/PHP/JavaScript/TypeScript、趣味でFlutter/Swiftなどを触ります。<br></br>
              以前は受託開発の会社でPHPとJavaScriptをメインに扱っていました。<br></br>
              今は某社で漫画アプリのバックエンドエンジニアとして日々GoやPHPと戯れています。<br></br>
              漫画とアニメが好きです。
            </p>
            <ul className={styles.list}>
              <li>
                <Link href="/articles">
                  <a className={styles.linkIcon}>
                    <BlogSvg></BlogSvg><span className={styles.listText}>Blog</span>
                  </a>
                </Link>
              </li>
              <li>
                <a href={`https://twitter.com/${config.social.twitter}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <TwitterSvg></TwitterSvg><span className={styles.listText}>Twitter</span>
                </a>
              </li>
              <li>
                <a href={`https://github.com/${config.social.github}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <GitHubSvg></GitHubSvg><span className={styles.listText}>GitHub</span>
                </a>
              </li>
              <li>
                <a href={`https://zenn.dev/${config.social.zenn}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <ZennSvg></ZennSvg><span className={styles.listText}>Zenn</span>
                </a>
              </li>
              <li>
                <a href={`https://qiita.com/${config.social.qiita}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <img className={styles.qiitaIcon} src={`/images/${config.image.qiita}`} /><span className={styles.listText}>Qiita</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
