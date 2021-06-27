import Link from "next/link";
import { ArticleHeader } from "../models";
// import { CreatedAt } from "./CreatedAt";
// import { UpdatedAt } from "./UpdatedAt";
import styles from "./ArticleItem.module.css";

type Props = { article: ArticleHeader };

export const ArticleItem: React.VFC<Props> = ({ article }) => {
  // const imageUrl = article.matterData.imageUrl ?? "/images/no-image.png";

  return (
    <div className={styles.root}>
      {/* <img className={styles.image} src={imageUrl} alt="article catch" /> */}
      <div className={styles.info}>
        <h2 className={styles.title}>
          <Link href={`/posts/${article.id}`}>
            <a className={styles.titleLink}>{article.matterData.title}</a>
          </Link>
        </h2>
        <div className={styles.metaInfo}>
          {/* {!!article.matterData.updatedAt ? (
            <UpdatedAt updatedAt={article.matterData.updatedAt} />
          ) : (
            <CreatedAt createdAt={article.matterData.createdAt} />
          )} */}
        </div>
      </div>
    </div>
  );
};
