---
title: "LaravelでPush通知の送信処理"
createdAt: "2021-12-22 12:15:00"
updatedAt: ""
published: true
---

# はじめに

こんにちは。<br>
にしやまです。

遅くなってしまい大変申し訳ございませんなのですが、この記事は[TechCommit アドベントカレンダー2021](https://qiita.com/advent-calendar/2021/tech-commit)の投稿です。

今回は[Firebase Admin SDK for PHP（非公式）](https://firebase-php.readthedocs.io/en/5.14.1/cloud-messaging.html)を利用したLaravelでPush通知の送信処理について書いてみたいと思います。<br>
PHPがGoogleに見捨てられてしまったので、Googleさんは公式でPHPのAdminSDKを用意してくれていません。かなしいね。（個人の感想です。本当に見捨てられてしまってるかは存じ上げません。）

# Push通知とは

Push通知の基本的な仕組みとして、Kii Cloudさんの
[プッシュ通知の仕組み](https://docs.kii.com/ja/guides/cloudsdk/android/managing-push-notification/push-overview/structure/)という記事がわかりやすかったので参考になるかもです。<br>
上記の記事内の、「アプリケーションサーバー（Kii Cloud）」の役割を担う部分が今回の実装対象になります。

また、FCMの公式の[FCM アーキテクチャの概要](https://firebase.google.com/docs/cloud-messaging/fcm-architecture?hl=ja)もけっこうわかりやすいので一読してみるといいかもです。

サーバー側からGoogleやAppleの管理するプッシュ通知配信サーバーを介して各ユーザーの端末に送信されています。<br>
なので、今回の実装は「GoogleやAppleのプッシュ通知配信サーバー」に対してプッシュ通知送信を依頼する処理の書き方になります。<br>
前述のFirebase Admin SDK for PHP（非公式）を利用してそれを行っています。

ちなみに、Firebase Admin SDK for PHP（非公式）の場合だと、Appleのプッシュ通知配信サーバー（APNs）に直接送るのではなく、FCMを介してAPNsに送信しています。

実際の送信処理を見てみましょう。


# Push通知送信

## 要件

今回のPush通知は以下の要件の想定のもとの実装になります。

- 同一のメッセージを複数ユーザーに送信する
- サイレントプッシュと通常のプッシュとして送る場合がある
    - [iOS の Push 通知の種類](https://zenn.dev/attomicgm/articles/about_ios_push_type)
    - リッチプッシュは行わない
- サイレントプッシュの際、アプリ側で受け取った後なんらかの処理を行う
- 通常のプッシュの場合端末側にポップアップ表示＋付随するなんらかの処理を行う
- デバイストークンは管理しているが、そのトークンの端末がiOSかAndroidかは管理していない
- 今回はDB処理などは書かない予定なので、プッシュ通知送信に必要なデータはリクエストから受け取ることにしている

## 事前準備

1. Laravelの初期設定
    - 今回はLaravel6系を想定します。
    ```
    composer create-project laravel/laravel [プロジェクト名] --prefer-dist "6.0.*"
    ```
2. ライブラリのインストール
    ```
    composer require kreait/firebase-php
    ```
3. config/services.phpに以下を追記
    ```
    'firebase' => [
        'credentials' => env('FIREBASE_CRDENTIALS', '../firebase_credentials.json')
    ],
    ```
4. [firebaseのコンソール画面](https://console.firebase.google.com/u/1/)にiOS端末への通知送信に必要なAPNs認証キーを登録する
    - これだけで1記事書けてしまうので、[【iOS】Firebase Cloud Messagingで利用するAPNs認証キー・証明書の作り方](https://qiita.com/MYamate_jp/items/994a31d5408bc09998bc)などを参考にしてください。
5. [firebaseのコンソール画面](https://console.firebase.google.com/u/1/)から秘密鍵のjsonファイルをダウンロードする
    - コンソール画面から対象のプロジェクトを選択 > 左メニュー歯車 > プロジェクトの設定 > サービスアカウント > 新しい秘密鍵の生成
6. .envに以下を追記
    - ファイル名やディレクトリの場所は適宜変更する
    ```
    FIREBASE_CRDENTIALS=../firebase_credentials.json
    ```

## 実装

まずはControllerの呼び出し処理です。

```php
namespace App\Http\Controllers\App;

use App\Http\Requests\App\PushNotificationRequest;
use App\Helpers\FirebaseHelper;

class NotificationController extends Controller
{
    public function __construct()
    {
    }

    /**
     * Push通知送信
     * 
     * @param $status, $message, $data, $code
     * @return JSON
     */
    public function push(PushNotificationRequest $request): JSON
    {
        // $dataの中身
        // $data = [
        //     'title' => 'push title',
        //     'body' => 'push body',
        //     'silentPush' => 0 or 1,
        //     'pushTokens' => [
        //         'token1gjeijiofao',
        //         'token2faigachiod',
        //         'token3chaegjegea',
        //         ...
        //     ],
        // ]
        $data = $request->all();

        $response = (new FirebaseHelper())->pushNotificaton($data);

        if (!empty($response['success_count'])) {
          return response()->json(['成功したのがあるよ', $response]);
        }
        return response()->json(['全部失敗だよ', $response]);
    }
}
```

`PushNotificationRequest`の内容は要件に応じてよしなに。

`$response`の中の`success_count`に応じて成否のレスポンスを決めています。<br>
またこれはAPIで呼び出される機能である想定です。

ここはそんなに説明することないので、呼び出し元の`FirebaseHelper`について。

解説はできるだけコメントのところで詳しく書いていきます。

```php
namespace App\Helpers;

use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\AndroidConfig;
use Kreait\Firebase\Messaging\ApnsConfig;
use Kreait\Firebase\Factory;

class FirebaseHelper
{
    /**
     * Push通知送信処理
     * 
     * @param array $data push通知で送信したい内容や送信先のtokenの情報が含まれる
     * @return array
     */
    public function pushNotificaton(array $data): array
    {
        // sdkの初期化（秘密鍵のjsonファイルを指定する）
        $factory = (new Factory())->withServiceAccount(config('services.firebase.credentials'));
        // push初期化
        $messaging = $factory->createMessaging();

        // ペイロード作成（ペイロードとは通知として送る内容のことです）
        $message = $this->createPayload($data);

        // 複数端末へのpushの送信
        // "sendMulticast"を使用してtokenの配列を渡すことでそのトークンを持つ端末に対して一斉に通知を送ることができる
        $sendReport = $messaging->sendMulticast($message, $data['pushTokens']);

        // response作成
        // 内容は任意なので以下は一例です
        $failures = [];
        // マルチキャストで一括送信しても各送信ごとの送信失敗のエラーメッセージを取得できる
        foreach ($sendReport->failures()->getItems() as $index => $failure) {
            // ユーザーがアプリをアンストしてたりすると"Invalid token"とかのエラーが返ってきたりする
            $failures[] = $failure->error()->getMessage();
        }
        $successs = [];
        foreach ($sendReport->successes()->getItems() as $index => $success) {
            // 成功したら送信した内容とトークンが返ってくる
            $successs[] = $success->result();
        }

        return [
            'success_count' => $sendReport->successes()->count(),
            'failure_count' => $sendReport->failures()->count(),
            'success_messages' => $successs,
            'failure_messages' => $failures,
        ];
    }

    /**
     * payload作成
     *
     * @param array $data
     * @return Kreait\Firebase\Messaging\CloudMessage
     */
    private function createPayload(array $data): CloudMessage
    {
        $message = CloudMessage::new();

        if ($data['silentPush'] === 0) {
        // 通常のプッシュの場合はデータを送信する

            // Androidの設定（https://firebase-php.readthedocs.io/en/5.14.1/cloud-messaging.html#id2）
            // Androidに送る時"notofication"が含まれていると通知受信処理をOSに握られてonMessageReceivedが呼ばれなくなるのでdataのみで送信(https://firebase.google.com/docs/cloud-messaging/android/receive?hl=ja)
            $androidConfig = AndroidConfig::fromArray([
                'data' => [
                    // Androidはdataの内容をどう使うかは完全に実装次第になる
                    // iOSと違い、サイレントプッシュという機能があるわけではないのでAndroid側で受け取った後独自に通知のポップアップを作成する
                    'content_available' => 'false',
                    'title' => $data['title'],
                    'body' => $data['body'],
                ],
                'priority' => 'high',
            ]);
            // iOSの設定（https://firebase-php.readthedocs.io/en/5.14.1/cloud-messaging.html#apns）
            $apnsConfig = ApnsConfig::fromArray([
                'payload' => [
                    // "aps"の設定項目のリファレンス
                    // https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification#2943363
                    'aps' => [
                        'alert' => [
                            // iOSの場合、ここに設定したtitleとbodyがそのままプッシュ通知の内容として端末に表示される
                            'title' => $data['title'],
                            'body' => $data['body'],
                        ],
                        // 通知の音を鳴らす設定。iOSアプリ側に音源ファイルを設定しておけば任意の音声ファイルを指定することもできる
                        'sound' => 'default',
                    ],
                ],
            ]);
        } else {
        // サイレントプッシュの場合はデータは必要なく、プッシュが飛んできたことだけアプリで検知できれば良い

            $androidConfig = AndroidConfig::fromArray([
                'data' => [
                    // Android端末側で"content_available"が"true"なら通知のポップは表示させずにサイレントプッシュとして処理させる
                    'content_available' => 'true',
                ],
            ]);
            $apnsConfig = ApnsConfig::fromArray([
                'payload' => [
                    'aps' => [
                        // サイレントプッシュとして送信する設定
                        'content-available' => 1,
                    ],
                ],
            ]);
        }

        return $message
            ->withAndroidConfig($androidConfig)
            ->withApnsConfig($apnsConfig);
    }
}
```

こんな感じで送信処理を書きます。

今回はアプリ側での受信処理とかは割愛したいと思いますので、以上になります。

いつかの誰かの参考になれば嬉しいです。

