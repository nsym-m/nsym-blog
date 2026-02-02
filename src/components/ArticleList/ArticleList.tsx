import { ArticleHeader } from "../../models";
import { ArticleItem } from "../ArticleItem/ArticleItem";
import styles from "./ArticleList.module.css";

type Props = { articles: ArticleHeader[] };

export const ArticleList: React.FC<Props> = props => {
  return (
    <div className={styles.grid}>
      {props.articles.map(article => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </div>
  );
};
