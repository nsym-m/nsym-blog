export type FrontMatter = {
  title: string
  createdAt: string
  updatedAt?: string
  imageUrl?: string
  published: boolean
}

export type TocItem = {
  id: string
  text: string
  level: number // 2 = h2, 3 = h3
}

export type ArticleHeader = {
  id: string
  matterData: FrontMatter
  excerpt: string
}

export type ArticleHeaders = ArticleHeader[]

export type Article = {
  header: ArticleHeader
  bodyMdText: string
  toc: TocItem[]
}

export type ArticleIds = {
  id: string
}[]
