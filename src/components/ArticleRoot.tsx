import React from "react";
import { ArticleHeader } from "../models";
import ContentsLayout from "./ContentsLayout";
import { ArticleList } from "./ArticleList";

type Props = {
  articles: ArticleHeader[];
};

export const ArticleRoot: React.VFC<Props> = ({ articles }) => {
  return (
    <ContentsLayout>
      <ArticleList articles={articles} />
    </ContentsLayout>
  );
};
