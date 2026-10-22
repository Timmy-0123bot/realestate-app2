# 不動産管理アプリ

自分が登録した物件（物件名・家賃・エリア・間取り）を管理できるWebアプリです。
Supabaseの認証とデータベースを使い、ユーザーごとに物件データを分けて管理します。

**本番環境：** https://realestate-app2-tau.vercel.app/

## 主な機能

- メールアドレス＋パスワードでの会員登録・ログイン・ログアウト
- 未ログイン時はログイン画面へ自動でリダイレクト
- 物件の一覧表示・新規登録・編集・削除
- 自分が登録した物件だけを表示・編集・削除できる（SupabaseのRLSで制御）
- スマホ表示・ダークモード対応

## 技術スタック

| 分類 | 使用技術 |
|---|---|
| フロントエンド | React 19 / Vite / React Router |
| 認証・データベース | Supabase（Auth / PostgreSQL / RLS） |
| ホスティング | Vercel |
| Lint | oxlint |

## ローカルでの起動方法

### 1. 必要なもの

- Node.js（v20以上を推奨）
- Supabaseのプロジェクト

### 2. インストール

```bash
git clone https://github.com/Timmy-0123bot/realestate-app2.git
cd realestate-app2
npm install
```

### 3. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、SupabaseのProject URLとPublishable keyを設定します。
値はSupabaseダッシュボードの「Project Settings → API Keys」で確認できます。

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

> `.env` は `.gitignore` に登録済みのため、Gitにはコミットされません。

### 4. データベースの作成

Supabaseダッシュボードの **SQL Editor** で、以下のSQLを実行します。

| ファイル | 内容 |
|---|---|
| [`supabase/schema.sql`](supabase/schema.sql) | 物件テーブル・RLSポリシーの作成（必須） |
| [`supabase/seed.sql`](supabase/seed.sql) | サンプル物件の登録（任意。`demo@example.com` のユーザーが存在する場合のみ） |

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173/ を開き、会員登録してから利用してください。

## npmスクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用にビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run lint` | oxlintでコードをチェック |

## データベース設計

### `properties` テーブル

| カラム | 型 | 説明 |
|---|---|---|
| `id` | bigint | 主キー（自動採番） |
| `user_id` | uuid | 登録したユーザー（`auth.users` を参照。未指定時はログイン中のユーザー） |
| `name` | text | 物件名（1〜100文字） |
| `rent` | integer | 家賃（円、0以上） |
| `area` | text | エリア名（1〜100文字） |
| `layout` | text | 間取り（例：1LDK、1〜20文字） |
| `created_at` | timestamptz | 作成日時 |
| `updated_at` | timestamptz | 更新日時（更新時に自動で更新） |

### セキュリティ（RLS）

行レベルセキュリティを有効にし、ログインユーザーは **自分が登録した物件のみ** 操作できます。

| 操作 | ルール |
|---|---|
| SELECT | `user_id` が自分の行のみ表示 |
| INSERT | 自分の `user_id` でのみ登録可能（他人へのなりすまし不可） |
| UPDATE | 自分の行のみ編集可能（所有者の付け替え不可） |
| DELETE | 自分の行のみ削除可能 |

## ディレクトリ構成

```
├── src/
│   ├── components/      # 共通コンポーネント（フォーム、ルート保護、レイアウト、アイコン）
│   ├── contexts/        # 認証状態の管理（AuthProvider / useAuth）
│   ├── lib/             # Supabaseクライアント、物件のCRUD処理
│   ├── pages/           # ログイン・会員登録・物件一覧の各画面
│   ├── App.jsx          # ルーティング定義
│   └── index.css        # スタイル
├── supabase/            # テーブル定義・サンプルデータのSQL
├── .env.example         # 環境変数のサンプル
└── vercel.json          # Vercelのリライト設定
```

## 画面とURL

| URL | 画面 | アクセス |
|---|---|---|
| `/login` | ログイン | 未ログイン時のみ |
| `/signup` | 会員登録 | 未ログイン時のみ |
| `/properties` | 物件一覧（登録・編集・削除） | ログイン必須 |

上記以外のURLは `/properties` へ移動し、未ログインの場合はさらに `/login` へリダイレクトされます。

## デプロイ（Vercel）

1. VercelでこのGitHubリポジトリをインポートします（Framework Presetは **Vite**）。
2. 「Settings → Environment Variables」に `VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY` を設定します。
3. デプロイします。以降は `main` ブランチへのpushで自動デプロイされます。

- 環境変数を変更した場合は、再デプロイ（Redeploy）するまで反映されません。
- `vercel.json` で全URLを `index.html` に転送しているため、`/properties` などを直接開いたり再読み込みしたりしても404になりません。
