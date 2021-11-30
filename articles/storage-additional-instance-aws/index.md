---
title: "AWSのインスタンスのストレージを変更する"
createdAt: "2021-11-30 23:07:00"
updatedAt: ""
---


## はじめに

こんばんは。にしやまです。<br>
EC2を開発に利用しているとストレージが足りなくなって困る場合があります。

例えば、EC2にAPもDBも入れてて且つ複数のプロジェクトを1つのEC2インスタンス内に立てたい場合、元のストレージが少ないと2つ目のプロジェクトをデプロイできない、とかが起こります。

今回、ストレージを8GiB→20GiBに増やしたので、その手順を記します。

## ボリュームサイズの変更

まずは以下記事を参考に管理画面からの設定を行いました。<br>
[ご存知でしたか？EC2インスタンスは再起動なしにディスクサイズ(EBSボリュームサイズ)を増やせます](https://dev.classmethod.jp/articles/extending-disk-size-without-reboot/)

上記の設定が完了するとAWS上のインスタンスの詳細画面のストレージタブでボリュームサイズの値が変更されています。

## ファイルシステムの拡張

AWSの管理画面だけでは完了にはなりません。<br>
管理画面上から変更した設定を実際のOSにも反映させ、ファイルシステムを拡張させる必要があります。<br>
基本的には下記のドキュメントを参考に設定しています。<br>
[ボリュームサイズ変更後の Linux ファイルシステムの拡張](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html#extend-file-system )

ファイルシステム拡張のために以下の操作を行う必要があります。
1. ファイルシステム・パーティションの状態を確認
2. パーティションの拡張
3. ファイルシステムの拡張

### 1. ファイルシステム・パーティションの状態を確認

あくまで今回の場合なので必須ではないですが、<br>
最初に、とりあえずストレージが埋まっててもろもろの操作がやりにくく（タブ補完が使えないなど）不便だったので、不要なファイルを一旦消して取り急ぎ容量の回復を図りました。

```
[ec2-user ~]$ rm -rf /home/ec2-user/.cache/yarn/*
```
yarnのキャッシュは結構サイズが大きくて1GBくらいあるので開発用のサーバーならこういう時に軽い気持ちでyarnのキャッシュを消すことが多いです。

削除した上で、現状のファイルシステムの状況を確認します。<br>
`df`はファイルシステムの使用状況を確認するコマンド。<br>
（余談: ファイルがストレージがいっぱいになった時は`df -h`でファイルシステム全体の使用状況を見て、`du -sh /dir`でどこのディレクトリが容量を占めているか探すことが多いです。もっといい方法もあるかもですが。）
```
[ec2-user ~]$ df -h
ファイルシス   サイズ  使用  残り 使用% マウント位置
devtmpfs         482M     0  482M    0% /dev
tmpfs            492M     0  492M    0% /dev/shm
tmpfs            492M   50M  442M   11% /run
tmpfs            492M     0  492M    0% /sys/fs/cgroup
/dev/xvda1       8.0G  7.2G  849M   90% /
tmpfs             99M     0   99M    0% /run/user/1001
[ec2-user ~]$
```
**→ AWSの管理画面では20GiBにしたのにこちらでは8.0Gのままになっています。**

次に以下のコマンドで詳細を確認します。<br>
`lsblk`はブロックデバイスの一覧を表示し、パーティションの状態・ストレージの構成・デバイス番号などを確認することのできるコマンド。
```
[ec2-user ~]$ lsblk
NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
xvda    202:0    0  20G  0 disk
└─xvda1 202:1    0  8.0G  0 part /
[ec2-user ~]$
```

これはディスク容量は20Gになったけど、パーティションとして割り当てられているのは8Gのままであるということを指しています。<br>
**→ xvda1のパーティションにも20Gを割り当てる必要があります。**

現状のファイルシステムがどのタイプかによって利用するコマンドが変わるためファイルシステムのタイプを確認します。<br>
`df -hT`でタイプを確認できる（T: type、h: human readable）
```
[ec2-user ~]$ df -hT
ファイルシス   タイプ   サイズ  使用  残り 使用% マウント位置
devtmpfs       devtmpfs   482M     0  482M    0% /dev
tmpfs          tmpfs      492M     0  492M    0% /dev/shm
tmpfs          tmpfs      492M   50M  442M   11% /run
tmpfs          tmpfs      492M     0  492M    0% /sys/fs/cgroup
/dev/xvda1     xfs         20G  7.3G   13G   37% /
tmpfs          tmpfs       99M     0   99M    0% /run/user/1001
[ec2-user ~]$
```

**→ `/dev/xvda1`のファイルシステムは`xfs`という種類のファイルシステムであることがわかりました。**<br>
（余談: `xfs`はCentOS7でデフォルトで使われているファイルシステム（AmazonLinux2はCentOS7のCloneなのでおそらく`xfs`がデフォ）で、CentOS6では`ext4`というファイルシステムが使われていた）

### 2. パーティションの拡張

状況の確認ができたので、`growpart`というコマンドを使用してパーティションの拡張を行います。

```
[ec2-user ~]$ sudo growpart /dev/xvda 1
```
`/dev/xvda1`の数字で分けて第一引数と第二引数にする点に注意。<br>
このコマンドを実行すると、`lsblk`で確認したようにディスク容量に空きがあってパーティションの拡張の余地があれば自動で拡張してくれます。

実行結果を確認。<br>
パーティションが拡張された状態になっています。
```
[ec2-user ~]$ lsblk
NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
xvda    202:0    0  20G  0 disk
└─xvda1 202:1    0  20G  0 part /
[ec2-user ~]$
```

が、まだファイルシステムは拡張されていないです。<br>
```
[ec2-user ~]$ df -h
ファイルシス   サイズ  使用  残り 使用% マウント位置
devtmpfs         482M     0  482M    0% /dev
tmpfs            492M     0  492M    0% /dev/shm
tmpfs            492M   50M  442M   11% /run
tmpfs            492M     0  492M    0% /sys/fs/cgroup
/dev/xvda1       8.0G  7.2G  849M   90% /
tmpfs             99M     0   99M    0% /run/user/1001
[ec2-user ~]$
```
パーティションの拡張とファイルシステムの拡張は別のものなので、それぞれ設定が必要です。<br>
物理的なストレージを論理的に区切ったのがパーティションで、その中でファイルを管理する為にあるのがファイルシステム、というざっくりのイメージです。（間違ってたらごめんなさい）

### 3. ファイルシステムの拡張

`xfs`の場合、`xfs_growfs`というコマンドを使用してファイルシステムの拡張を行います。

対象のファイルシステムのマウント位置（`df`コマンドで確認）を引数に指定します。<br>
-dは指定可能な最大サイズまで拡張する引数。
```
[ec2-user ~]$ sudo xfs_growfs -d /
meta-data=/dev/xvda1             isize=512    agcount=4, agsize=524159 blks
　　　　　=                       sectsz=512   attr=2, projid32bit=1
　　　　　=                       crc=1        finobt=1 spinodes=0
data　　 =                       bsize=4096   blocks=2096635, imaxpct=25
　　　　　=                       sunit=0      swidth=0 blks
naming 　=version 2              bsize=4096   ascii-ci=0 ftype=1
log 　　 =internal               bsize=4096   blocks=2560, version=2
　　　　　=                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
data blocks changed from 2096635 to 5242363
[ec2-user ~]$
```

実行結果を確認。<br>
8G→20Gに増えています。
```
[ec2-user ~]$ df -h
ファイルシス   サイズ  使用  残り 使用% マウント位置
devtmpfs         482M     0  482M    0% /dev
tmpfs            492M     0  492M    0% /dev/shm
tmpfs            492M   50M  442M   11% /run
tmpfs            492M     0  492M    0% /sys/fs/cgroup
/dev/xvda1        20G  7.2G   13G   36% /
tmpfs             99M     0   99M    0% /run/user/1001
[ec2-user ~]$
```

以上で完了です。

ファイルシステム周りにつてあまり詳しくないので、駆け足な説明になってしまいました。<br>
今度またファイルシステムについてもう少し踏み込んで調べてみたいと思います。

では。