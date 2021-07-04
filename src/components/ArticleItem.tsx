import Link from "next/link";
import { ArticleHeader } from "../models";
import styles from "./ArticleItem.module.css";
import Date from "./Date";

type Props = { article: ArticleHeader };

export const ArticleItem: React.VFC<Props> = ({ article }) => {

  return (
    <div className={styles.root}>
      <Link href={`/articles/${article.id}`}>
        <a className={styles.titleLink}>
          <div className={styles.info}>
            <div className={styles.title}>
              {article.matterData.title}
            </div>
            <div className={styles.metaInfo}>
              <Date dateString={article.matterData.createdAt} className={styles.date} />
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};
