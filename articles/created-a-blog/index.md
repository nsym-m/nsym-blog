---
title: "ブログを作りました"
createdAt: "2021-07-24 19:25:00"
updatedAt: ""
published: true
---

# 自己紹介

初めまして。
にしやまと申します。

静岡県の受託開発で働いているエンジニアです。
よく使う言語はPHPです。 
 
エンジニアたるもの自分のブログくらい自分で作ろう、みたいなイメージがありブログを作ってみました。

# このブログについて

Next.jsで作っています。

Markdownで記事を書いて、それをHTMLにレンダリングさせるという管理画面いらずのお手軽ブログです。

Next.jsを選んだ理由はReact系のライブラリ/FWに触ってみたかったからです。

感想としては、JSがある程度書ければ何しているかはわかるけど、FW独自の動きはドキュメントで把握しないとまあわからないよね、というわりと当たり前のことでした。

本当はいろいろ残件あるんですが、
さっさとリリースして他のことに手をつけたい気持ちが強かったので、こちらは最低限でリリースしました。（それでも結構時間かかってしもた）

# ちょこっと技術紹介

- Markdown -> HTML のレンダリング
  - `remark`, `remark-html`を利用
  - シンタックスハイライトには`@stefanprobst/remark-shiki`を利用
    - 最初は`remark-highlight.js`を使用していたが、 プレダグ`<pre></pre>` にclassが付与されずうまいこといかなかったのでライブラリを変更して対応。

PHPレンダリングテスト
```php
class HelloWorld
{
    public string $text;

    public function __construct(string $text)
    {
        $this->text = $text;
    }

    public function printHelloWorld(): void
    {
        print_r($this->text);
    }
}

$helloWorld = new HelloWorld("Hello World");
$helloWorld->printHelloWorld();

```

TSレンダリングテスト（Markdown -> HTML のレンダリングをしている箇所）
```typescript
export async function getArticleData(id: string) {
    const fullPath = path.join(articlesDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const { frontMatter, content } = getFrontMatter(id, fileContents)

    const processedContent = await remark()
        .use(remarkShiki)
        .use(html)
        .process(content)
    const contentHtml = processedContent.toString()

    const excerpt = await getArticleExcerpt(content)

    const tocMdText = markdownToc(content).content;

    // Combine the data with the id and contentHtml
    return {
        header: {
            id,
            matterData: frontMatter,
            excerpt,
        },
        bodyMdText: contentHtml,
        tocMdText,
    };
}
```

# 終わりに

まぁ最初はこんなもんでいいでしょう。

これからできるだけ頻繁に更新していく予定です。（がんばります）

ブログを公開した次の目標は応用情報取得なので、これからは応用情報の勉強をしつつ、その内容をブログに書いていけたらと思っています。

では。
