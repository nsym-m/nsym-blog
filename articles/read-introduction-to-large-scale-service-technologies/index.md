---
title: "「大規模サービス技術入門」を読んだ感想"
createdAt: "2023-05-05 03:00:00"
updatedAt: ""
published: true
---

こんばんは。

この本ははてなの研修の内容を書籍に起こしたもので、はてなが数多くの障害を実際に乗り越えてきた知見がふんだんに詰まっていてとても良い本でした。

読みながらこのツイートのスレッドに感想やメモを書き込んでいたので、それを簡単にまとめる形にします。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">今日から大規模サービス技術入門を読む<br>1週間以内くらいでさくっと読みたい <a href="https://t.co/ykBPo6Fg5F">pic.twitter.com/ykBPo6Fg5F</a></p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1649054487724847105?ref_src=twsrc%5Etfw">April 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


なお、インフラ構成の話などもありますが、この本の出版時(2010年)はまだクラウドが主流ではなかった（話題になってはいたがはてなはAmazon CloudFront以外は使用していなかった）のでその点だけ留意して読む方が良いです。

書籍のリンクはこちらに。<br>
[https://gihyo.jp/book/2010/978-4-7741-4307-1](https://gihyo.jp/book/2010/978-4-7741-4307-1)

章立ては下記の通りです。<br>
第1回　大規模Webサービスの開発オリエンテーション―全体像を把握する<br>
第2回　大規模データ処理入門 ―メモリとディスク，Webアプリケーションと負荷<br>
第3回　OSのキャッシュと分散 ―大きなデータを効率良く扱うしくみ<br>
第4回　DBのスケールアウト戦略 ―分散を考慮したMySQLの運用<br>
第5回　大規模データ処理［実践］入門 ―アプリケーション開発の勘所<br>
第6回　［課題］圧縮プログラミング ―データサイズ，I/O高速化との関係を意識する<br>
第7回　アルゴリズムの実用化 ―身近な例で見る理論・研究の実践投入<br>
第8回　［課題］はてなキーワードリンクの実装 ―応用への道筋を知る<br>
第9回　全文検索技術に挑戦 ―大規模データ処理のノウハウ満載<br>
第10回　［課題］全文検索エンジンの作成 ―基本部分，作り込み，速度と精度の追求<br>
第11回　大規模データ処理を支えるサーバ/インフラ入門 ―Webサービスのバックエンド<br>
第12回　スケーラビリティの確保に必要な考え方 ―規模の増大とシステムの拡張<br>
第13回　冗長性の確保，システムの安定化 ―ほぼ100％の稼動率を実現するしくみ<br>
第14回　効率向上作戦 ―ハードウェアのリソースの使用率を上げる<br>
第15回　Webサービスとネットワーク ―ネットワークで見えてくるサービスの成長<br>
特別編　いまどきのWebサービス構築に求められる実践技術 ―大規模サービスに対応するために<br>


以降面白かったところをいくつか拾っていきます。

第2回

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">大規模データの難しさはメモリ内で計算できないところ<br>・メモリ内で計算できないとディスクにあるデータを検索する必要がある<br>・ディスクは遅いのでI/Oに時間がかかる<br>　・メモリはディスク(HDD)の10の5乗から6乗以上高速</p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1649081124126351360?ref_src=twsrc%5Etfw">April 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

第3回<br>
Linuxはページキャッシュでファイルの情報をメモリにも保持するという話。<br>

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Linuxのページキャッシュはディスクの内容を4KB程度のブロック(ページという)としてメモリに確保(LRU)し、解放せずずっと残しておく。VFSがこの機能を持っている。メモリより大きいサイズのファイルでも4KB程度のページ単位でキャッシュすることが可能。</p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1649445952372211713?ref_src=twsrc%5Etfw">April 21, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

第4回<br>
MySQLのB木インデックスはOSの挙動と同調させることでさらにチューニングさせることができるという話。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">OSはディスクからデータを読む際ブロック単位で読み出す。ここでディスクシークが発生する為遅い。<br>MySQLで使われるB木(B+木)indexはノードの子の数を任意に決められる。これをディスクのブロックと同じにするとノード内のデータはOSが1回でメモリに読むので、ディスクシークなしで探索できる。</p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1649476630656749569?ref_src=twsrc%5Etfw">April 21, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


第6回<br>
大規模データを扱う際のデータを圧縮して処理する手法。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">整数列の圧縮にはもう一工夫必要。<br>- 整数列を昇順ソート<br>- 先頭からの差分を取った整数列に変える<br> - 先頭から足していけば元の数値に戻せる形で小さい数字に変換できる<br>例:1,2,5,100,105,108,200,230<br>→ 1,1,3,95,5,3,92,30<br>- VBCodeで圧縮<br><br>これは脱帽レベルで賢い</p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1650563349011382272?ref_src=twsrc%5Etfw">April 24, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

第7回<br>
正規表現で処理していたがデータ量が多くなり問題が発生したので別のデータ構造を使うようにした話。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">はてなダイアリーのキーワードリンクという機能の改善でTrie構造をさらに高速化させたAho-Corasick法(AC法)という手法が紹介されてるんだけど難しい...。<br><br>著者の書いたブログもあった<a href="https://t.co/rdDduqjWTj">https://t.co/rdDduqjWTj</a></p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1651942764085678080?ref_src=twsrc%5Etfw">April 28, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

余談<br>
ChatGPT4まじで便利すぎる

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">勉強しててわからないことがあったらChatGPTに聞くの良すぎてもう離れられない<br>教えてほしいところをピンポイントで聞けるのが最高に良い <a href="https://t.co/hlXUwt7rlc">pic.twitter.com/hlXUwt7rlc</a></p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1651950408351502337?ref_src=twsrc%5Etfw">April 28, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

第7回<br>
AC法の仕組み

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">1. 今の自分の位置と同じ文字が登録されている場所を探す<br>2. それがあればそこから今の次の文字に続くか探す<br>3. 1,2でなければ根に戻り今の次の文字に続く場所を探す<br>4. 2,3で見つかればそれがfailureの値になる<br>5. 2,3で見つからなければfailureの値は0になる<br>完全に理解した<a href="https://t.co/juiK1EwxOT">https://t.co/juiK1EwxOT</a></p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1653109769484505089?ref_src=twsrc%5Etfw">May 1, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

第9回<br>
全文検索エンジンの内部構造

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">検索エンジンの転置インデックスの内部構造はDictionaryとPositingsに分かれてる<br>Dictionaryは検索対象のドキュメントを単語(term)に区切った集合、Positingsはtermの位置情報の配列<br>ドキュメント→term化は下記でする<br>- 単語をtermとして扱う<br> - 辞書+AC法<br> - 形態素解析<br>- n-gramをtermとして扱う</p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1653688287616442371?ref_src=twsrc%5Etfw">May 3, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

第11~15回, 特別編

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">読み終わった。11~15章と最後の特別編はそれまで開設した技術ではてながどういうインフラを組んでいるかの解説だった。</p>&mdash; にしやま (@nsym__m) <a href="https://twitter.com/nsym__m/status/1654173278485741574?ref_src=twsrc%5Etfw">May 4, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
