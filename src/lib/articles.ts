import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import strip from 'strip-markdown'
import markdownToc from 'markdown-toc'
import html from 'remark-html'
import remarkShiki from '@stefanprobst/remark-shiki'
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

  return {
    frontMatter: {
      ...matterData,
      title: matterData.title,
      createdAt: matterData.createdAt,
    },
    content: matterResult.content,
  }
}

async function getArticleExcerpt(mdText: string): Promise<string> {
  const processed = await remark().use(strip).process(mdText)

  const contentText = processed.toString()

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
  // Sort articles by date
  return (await Promise.all(allArticlesData)).sort((a, b) =>
    a.matterData.createdAt < b.matterData.createdAt ? 1 : -1,
  )
}

export function getAllArticleIds(): ArticleIds {
  const fileNames = fs.readdirSync(articlesDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export async function getArticleData(id: string): Promise<Article> {
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
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkShiki, { theme: theme })
    .use(html)
    .process(content)
  const contentHtml = processedContent.toString()

  const excerpt = await getArticleExcerpt(content)

  const tocMdText = markdownToc(content).content

  // Combine the data with the id and contentHtml
  return {
    header: {
      id,
      matterData: frontMatter,
      excerpt,
    },
    bodyMdText: contentHtml,
    tocMdText,
  }
}
