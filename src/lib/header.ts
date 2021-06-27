import fs from 'fs'
import path from 'path'
import remark from 'remark'
import html from 'remark-html'
import highlight from 'remark-highlight.js'

const headerDirectory = path.join(process.cwd(), 'content/header')
console.log(headerDirectory)

// 自己紹介のヘッダーも markdown から HTML を生成する
export async function getHeaderHtml() {
  const fullPath = path.join(headerDirectory, 'header.md')
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(highlight)
    .use(html)
    .process(fileContents)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return contentHtml
}
