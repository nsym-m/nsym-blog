import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'
import { FrontMatter, ArticleIds, Article, ArticleHeaders } from '../models'
import { config } from '../config'

const articlesDirectory = path.join(process.cwd(), 'articles')

function getFrontMatter(
  id: string,
  rawData: string,
): { frontMatter: FrontMatter; content: string } {
  const matterResult = matter(rawData)

  const matterData = matterResult.data as Partial<FrontMatter>

  if (!matterData.title) {
    throw new Error(`${id}: title is required in front-matter`)
  }

  if (!matterData.createdAt) {
    throw new Error(`${id}: createdAt is required in front-matter`)
  }

  if (matterData.published == undefined) {
    throw new Error(`${id}: published is required in front-matter`)
  }

  return {
    frontMatter: {
      ...matterData,
      title: matterData.title,
      createdAt: matterData.createdAt,
      published: matterData.published,
    },
    content: matterResult.content,
  }
}

async function getArticleExcerpt(mdText: string): Promise<string> {
  const contentText = (
    await remark().use(remarkParse).use(strip).process(mdText)
  ).toString()

  const excerpt = contentText
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, config.excerptLength)

  if (contentText.length > config.excerptLength) {
    return excerpt + '...'
  }

  return excerpt
}

export async function getSortedArticlesData(): Promise<ArticleHeaders> {
  // Get file names under /articles
  const dirNames = fs.readdirSync(articlesDirectory)
  const allArticlesData = dirNames.map(async (dirName) => {
    const id = dirName
    // articles/{id}/index.md
    const fullPath = path.join(articlesDirectory, id, config.articleFileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the article metadata section
    const { frontMatter, content } = getFrontMatter(id, fileContents)

    // Combine the data with the id
    return {
      id,
      matterData: frontMatter,
      excerpt: await getArticleExcerpt(content),
    }
  })

  // filtering published
  const publishedArticles = (await Promise.all(allArticlesData)).filter(
    (article) => article.matterData.published,
  )
  // Sort articles by date
  return (await Promise.all(publishedArticles)).sort((a, b) =>
    a.matterData.createdAt < b.matterData.createdAt ? 1 : -1,
  )
}

export function getAllArticleIds(): ArticleIds {
  const fileNames = fs.readdirSync(articlesDirectory)
  return fileNames.map((fileName) => {
    return {
      id: fileName.replace(/\.md$/, ''),
    }
  })
}

export async function getArticle(id: string): Promise<Article> {
  // articles/{id}/index.md
  const fullPath = path.join(articlesDirectory, id, config.articleFileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the article metadata section
  const { frontMatter, content } = getFrontMatter(id, fileContents)

  const theme = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), `src/assets/${config.codeTheme}`),
      'utf-8',
    ),
  )

  const contentHtml = (
    await unified()
      .use(remarkParse)
      .use(remark2rehype)
      .use(rehypePrettyCode, {
        theme: theme,
      })
      .use(rehypeStringify)
      .process(content)
  ).toString()

  const excerpt = await getArticleExcerpt(content)

  // Combine the data with the id and contentHtml
  return {
    header: {
      id,
      matterData: frontMatter,
      excerpt,
    },
    bodyMdText: contentHtml,
  }
}
