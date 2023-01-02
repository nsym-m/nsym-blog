---
title: "MySQLが勝手に落ちる"
createdAt: "2021-07-25 20:06:00"
updatedAt: "2021-08-22 01:01:00"
published: true
---

こんばんは。
にしやまです。

大して内容がなくても積極的に記事にしていこうと思っているので雑に書いていきます。

さっきとあるサーバのシステムを動かしていたらMySQLが落ちているエラーが発生していることに気づきました。

その問題と解決までの一連の経緯を記します。

# 経緯

- EC2にサーバ構築（PHP8, MySQL8, Nginx）
- サービスのデプロイ（本番ではありません）
- 数時間後、MySQLがexit
- ログイン出来なくて問題発覚

# 問題

`storage/logs/laravel-07-21.log`を見てみたところ、ログイン失敗時のログに以下のように記載されていた。
``` 
ERROR: SQLSTATE[HY000] [2002] Connection refused
```
とりあえずMySQLの起動状態を確認しようと思い、状態確認。
```bash
$ systemctl status mysqld
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since 水 2021-07-21 13:26:01 UTC; 3 days ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 26012 ExecStart=/usr/sbin/mysqld $MYSQLD_OPTS (code=exited, status=1/FAILURE)
  Process: 25849 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 26012 (code=exited, status=1/FAILURE)
   Status: "Server startup in progress"

 7月 21 13:25:55 compute.internal systemd[1]: ...
 7月 21 13:25:55 compute.internal systemd[1]: ...
 7月 21 13:25:55 compute.internal systemd[1]: ...
 7月 21 13:25:56 compute.internal systemd[1]: ...
 7月 21 13:25:56 compute.internal systemd[1]: ...
 7月 21 13:25:56 compute.internal systemd[1]: ...
 7月 21 13:26:01 compute.internal systemd[1]: ...
 7月 21 13:26:01 compute.internal systemd[1]: ...
 7月 21 13:26:01 compute.internal systemd[1]: ...
 7月 21 13:26:01 compute.internal systemd[1]: ...
Hint: Some lines were ellipsized, use -l to show in full.
```
次にsystemdのログを確認
```bash
$ journalctl -u mysqld
-- Logs begin at 日 2021-07-18 13:41:43 UTC, end at 日 2021-07-25 10:23:35 UTC. --
 7月 21 03:31:47 compute.internal systemd[1]: Starting MySQL Server...
 7月 21 03:31:55 compute.internal systemd[1]: Started MySQL Server.
 7月 21 11:14:46 compute.internal systemd[1]: mysqld.service: main process exited, code=killed, status=9/KILL
 7月 21 11:14:46 compute.internal systemd[1]: Unit mysqld.service entered failed state.
 7月 21 11:14:46 compute.internal systemd[1]: mysqld.service failed.
 7月 21 11:14:47 compute.internal systemd[1]: mysqld.service holdoff time over, scheduling restart.
 7月 21 11:14:47 compute.internal systemd[1]: Stopped MySQL Server.
 7月 21 11:14:47 compute.internal systemd[1]: Starting MySQL Server...
 7月 21 11:14:52 compute.internal systemd[1]: mysqld.service: main process exited, code=exited, status=1/FAILURE
 7月 21 11:14:52 compute.internal systemd[1]: Failed to start MySQL Server.
 7月 21 11:14:52 compute.internal systemd[1]: Unit mysqld.service entered failed state.
 7月 21 11:14:52 compute.internal systemd[1]: mysqld.service failed.
 7月 21 11:23:07 compute.internal systemd[1]: Starting MySQL Server...
 7月 21 11:23:11 compute.internal systemd[1]: Started MySQL Server.
 7月 21 13:25:55 compute.internal systemd[1]: mysqld.service: main process exited, code=killed, status=9/KILL
 7月 21 13:25:55 compute.internal systemd[1]: Unit mysqld.service entered failed state.
 7月 21 13:25:55 compute.internal systemd[1]: mysqld.service failed.
 7月 21 13:25:56 compute.internal systemd[1]: mysqld.service holdoff time over, scheduling restart.
 7月 21 13:25:56 compute.internal systemd[1]: Stopped MySQL Server.
 7月 21 13:25:56 compute.internal systemd[1]: Starting MySQL Server...
 7月 21 13:26:01 compute.internal systemd[1]: mysqld.service: main process exited, code=exited, status=1/FAILURE
 7月 21 13:26:01 compute.internal systemd[1]: Failed to start MySQL Server.
 7月 21 13:26:01 compute.internal systemd[1]: Unit mysqld.service entered failed state.
 7月 21 13:26:01 compute.internal systemd[1]: mysqld.service failed.
 7月 25 09:13:35 compute.internal systemd[1]: Starting MySQL Server...
 7月 25 09:13:38 compute.internal systemd[1]: Started MySQL Server.
```

"7月 21 03:31:55"に正常起動しているのに、"7月 21 11:14:46"にプロセスがkillされているのが気がかりですね。

11:14:46のaccess.logを確認しましたが何もありませんでした。<br>

ともあれ問題の発生した頃のMySQLのログを確認。
```
2021-07-21T03:31:55.211317Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.26'  socket: '/var/lib/mysql/mysql.sock'  port: 3306  MySQL Community Server - GPL.
2021-07-21T11:14:51.150609Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.26) starting as process 25112
2021-07-21T11:14:51.528481Z 0 [Warning] [MY-010001] [Server] Can't create thread to handle bootstrap (errno: 12)
2021-07-21T11:14:51.533415Z 0 [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
2021-07-21T11:14:51.535144Z 0 [ERROR] [MY-010119] [Server] Aborting
2021-07-21T11:14:52.130750Z 0 [System] [MY-010910] [Server] /usr/sbin/mysqld: Shutdown complete (mysqld 8.0.26)  MySQL Community Server - GPL.
```

"Data Dictionary initialization failed."がそれっぽいので検索。

# 対策1

いくつか出てきましたが、今回は[MySQL 8 won't start after “Data dictionary upgrading” in log file
](https://stackoverflow.com/questions/55846631/mysql-8-wont-start-after-data-dictionary-upgrading-in-log-file)という記事をあてにすることにしました。
その他に出てきたものは大体設定済みだったので。
**追記：こちらは解決策ではないので注意**

（my.cnfに`datadir`や`log-error`が設定されていないのでそれらを設定しましょうという内容が多かった）

手元のよく使っているdockerのmy.cnfや過去に設定したMySQL8系のmy.cnfを確認してみると確かに上記記事のように`utf8mb4`の記述があったので、まぁ可能性はあるかなぁと。

ただ、根本の原因（特に起動できていたのに突然exitしたあたり）はなぜか分かっていないので、もう少し様子見したいですね。

今のところは上記記事に従い`my.cnf`に追記し、以下のようにして問題なく稼働しています。（まだ数時間なのでわからないですが）

```
[mysqld]

datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock

log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

character_set_server = utf8mb4
collation_server = utf8mb4_ja_0900_as_cs_ks

[mysql]
default-character-set = utf8mb4

[client]
default-character-set = utf8mb4
```

# 原因

原因が判明したので追記です。
本当は結構前にわかってたけど更新が遅くなってしまった。。

結論としては、このサーバーはEC2の一番小さいやつを使っていたので、メモリ容量が少なく、MySQLがメモリ圧迫して落ちていました。
また、デフォルトでswapファイルも存在しないサーバーだったこともあるようです。

対策としては、契約するサーバーのメモリを大きくする、DBサーバーを別にする、swapファイルを作成する、などあります。
今回はswapファイルを作成したのでその手順も記載します。

# 解決法

```bash
# メモリ状態の確認（swapがない状態）
$ sudo free
# 空の1024mbのファイルを作成
$ sudo dd if=/dev/zero of=/swapfile bs=1M count = 1024
# 作成したファイルをswapファイルにする
$ sudo mkswap /swapfile
# swapファイルを有効化
$ sudo swapon /swapfile
# メモリ状態の確認（作成したswapファイル分が表示されるようになる）
$ sudo free
$ sudo systemctl restart mysqld
```
