import styles from "./AboutMe.module.css";
import { config } from "../../config";
import { Twitter } from "../Icons/Twitter";
import { GitHub } from "../Icons/GitHub";
import { Zenn } from "../Icons/Zenn";
import Link from "next/link";
import { Blog } from "../Icons/Blog";
import Image from "next/image"

export const AboutMe: React.VFC = () => {
  return (
    <div>
      <div className={styles.avatarDiv}>
        <Image
          className={styles.avatar}
          src={`/images/${config.image.avatar}`}
          alt="avatar"
          width={200}
          height={200}
          style={{
            maxWidth: "100%",
            height: "auto"
          }}></Image>
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
                <Link href="/articles" className={styles.linkIcon}>
                  <Blog></Blog><span className={styles.listText}>Blog</span>
                </Link>
              </li>
              <li>
                <a href={`https://twitter.com/${config.social.twitter}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <Twitter></Twitter><span className={styles.listText}>Twitter</span>
                </a>
              </li>
              <li>
                <a href={`https://github.com/${config.social.github}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <GitHub></GitHub><span className={styles.listText}>GitHub</span>
                </a>
              </li>
              <li>
                <a href={`https://zenn.dev/${config.social.zenn}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <Zenn></Zenn><span className={styles.listText}>Zenn</span>
                </a>
              </li>
              <li>
                <a href={`https://qiita.com/${config.social.qiita}`} target="_blank" className={styles.linkIcon} rel="noreferrer">
                  <Image
                    className={styles.qiitaIcon}
                    src={`/images/${config.image.qiita}`}
                    alt="qiitaリンク"
                    width={30}
                    height={30}
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }}></Image>
                    <span className={styles.listText}>Qiita</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
