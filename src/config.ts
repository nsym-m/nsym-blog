export const config = {
  siteTitle: "nsym's blog",
  siteUrl: 'https://nsym.dev',
  social: {
    twitter: 'nsym__m',
    github: 'nsym-m',
    zenn: 'nishiyama',
    qiita: 'nsym__m',
  },
  image: {
    avatar: 'profile.jpg',
    header: 'header.jpg',
    qiita: 'qiita.png',
  },
  excerptLength: 160,
  articleFileName: 'index.md',
  // dark-colorblind.jsonはGitHubのカラーテーマ。下記手順でjson取得
  // see: https://github.com/primer/github-vscode-theme/tree/main
  // $ git clone git@github.com:primer/github-vscode-theme.git
  // $ cd github-vscode-theme
  // $ npm install
  // $ npm run start
  // 別プロセスのシェル起動
  // $ cp themes/dark-colorblind.json ../nsym-blog/src/assets
  // 他のテーマはリポジトリやVS Codeのアプリディレクトリ内にjsonがあるがGitHubのはなく、リポジトリ内でjson生成していたためこのように対応
  codeTheme: 'dark-colorblind.json',
} as const
