import { ArticleHeader } from "../../models";
import { ArticleItem } from "../ArticleItem/ArticleItem";

type Props = { articles: ArticleHeader[] };

export const ArticleList: React.VFC<Props> = props => {
  return (
    <div>
      {props.articles.map(article => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </div>
  );
};
