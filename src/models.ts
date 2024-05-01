export type FrontMatter = {
  title: string
  createdAt: string
  updatedAt?: string
  imageUrl?: string
  published: boolean
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
}

export type ArticleIds = {
  id: string
}[]
