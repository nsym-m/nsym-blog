---
title: "Release notes 20240818"
createdAt: "2024-08-18 07:35:00"
updatedAt: ""
published: true
---


## はじめに

こんにちは。にしやまです。
リリースノートです。いくつか掻い摘んで。

## Release notes

- Next14 App Router対応
    - [#16](https://github.com/nsym-m/nsym-blog/pull/16)
- ダークモード対応
    - [#18](https://github.com/nsym-m/nsym-blog/pull/18)
- Next12以降マークダウン中のソースコードが表示されなくなっていたバグの修正
    - [#27](https://github.com/nsym-m/nsym-blog/pull/27)


> Next12以降マークダウン中のソースコードが表示されなくなっていたバグの修正

こちらは実は3ヶ月くらいずっと放置してました......w


直した箇所簡単に載せます。
`remark`と`remark-html`でHTML化していたところを`unified`と`remark`、`rehype`を使うように修正しました（`remark-html`はこれらのラッパー）。
これで直ったので詳しくは追ってないですが、`remark-html`を使っていることでソースコード部分が変換されなくなっていたようです。

```typescript
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

//   修正前
//   const processedContent = await remark()
//     .use(remarkShiki, { theme: theme })
//     .use(html)
//     .process(content)
//   const contentHtml = processedContent.toString()

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
```

また、ついでに普段自分が使ってるVS Codeのカラーテーマと同じ「GitHub Dark Colorblind」というテーマを使用するようにしました。
これまでは利用するテーマのリポジトリやアプリケーション実行ファイルからjsonファイルを拾ってきて自分のリポジトリに配置するだけだったのですが、GitHubのテーマはjsonが置いてなくて一工夫必要でした。
`npm run start`を実行するとプロセス内でjsonが生成されるので自分のリポジトリに持ってこれるようになるというわけです。
```zsh
# see: https://github.com/primer/github-vscode-theme/tree/main
$ git clone git@github.com:primer/github-vscode-theme.git
$ cd github-vscode-theme
$ npm install
$ npm run start
# 別プロセスのシェル起動
$ cp themes/dark-colorblind.json ../nsym-blog/src/assets
```

ついでに、VS Codeのデフォルトのカラーテーマのjsonはこちらにあります（macOS Monterey 12.7.3の場合）
```zsh
ls /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/extensions/theme-defaults/themes/dark_vs.json 
```

今回はこの辺りで。
ではまたそのうち更新します。
