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
import rehypeSlug from 'rehype-slug'
import { visit } from 'unist-util-visit'
import type { Element } from 'hast'
import { FrontMatter, ArticleIds, Article, ArticleHeaders, TocItem } from '../models'
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

function extractTocFromMarkdown(mdText: string): TocItem[] {
  const toc: TocItem[] = []
  const lines = mdText.split('\n')

  for (const line of lines) {
    // h2 と h3 の見出しを抽出
    const h2Match = line.match(/^## (.+)$/)
    const h3Match = line.match(/^### (.+)$/)

    if (h2Match) {
      const text = h2Match[1].trim()
      const id = generateSlug(text)
      toc.push({ id, text, level: 2 })
    } else if (h3Match) {
      const text = h3Match[1].trim()
      const id = generateSlug(text)
      toc.push({ id, text, level: 3 })
    }
  }

  return toc
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '') // 英数字、日本語、スペース、ハイフンのみ残す
    .replace(/\s+/g, '-') // スペースをハイフンに
    .replace(/-+/g, '-') // 連続ハイフンを1つに
    .replace(/^-|-$/g, '') // 先頭と末尾のハイフンを削除
}

// すべてのコードブロックに行番号を追加するカスタムプラグイン
function rehypeAddLineNumbers() {
  return (tree: any) => {
    visit(tree, 'element', (node: Element) => {
      // <pre>要素を探す（コードブロックの親要素）
      if (node.tagName === 'pre') {
        // <pre>の中の<code>要素を探す
        const codeElement = node.children?.find(
          (child: any) => child.type === 'element' && child.tagName === 'code'
        ) as Element | undefined

        if (codeElement && codeElement.properties) {
          // 子要素にdata-line属性を持つ要素があるか確認（コードブロックの行）
          // data-line属性が存在すれば（値が空でも）行としてカウント
          const countLines = (element: any): number => {
            let count = 0
            if (element.type === 'element' && element.properties && 'data-line' in element.properties) {
              count = 1
            }
            if (element.children) {
              count += element.children.reduce((sum: number, child: any) => sum + countLines(child), 0)
            }
            return count
          }

          const lineCount = countLines(codeElement)
          if (lineCount > 0) {
            // data-line-numbers属性を追加
            if (!codeElement.properties) {
              codeElement.properties = {}
            }
            codeElement.properties['data-line-numbers'] = ''
            // 最大桁数を計算して追加
            const maxDigits = String(lineCount).length
            codeElement.properties['data-line-numbers-max-digits'] = String(maxDigits)
            // デバッグ用（本番では削除可能）
            console.log(`Added line numbers to code block: ${lineCount} lines, ${maxDigits} digits`)
          }
        }
      }
    })
  }
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
      .use(rehypeSlug) // 見出しに id を自動付与
      .use(rehypePrettyCode, {
        theme: theme,
      })
      .use(rehypeAddLineNumbers) // すべてのコードブロックに行番号を追加
      .use(rehypeStringify)
      .process(content)
  ).toString()

  const excerpt = await getArticleExcerpt(content)
  const toc = extractTocFromMarkdown(content)

  // Combine the data with the id and contentHtml
  return {
    header: {
      id,
      matterData: frontMatter,
      excerpt,
    },
    bodyMdText: contentHtml,
    toc,
  }
}
