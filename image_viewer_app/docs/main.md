# 画像ビューワーアプリケーション仕様書

## 1. プロジェクト概要

### 技術スタック
- フロントエンド: Next.js
- スタイリング: Tailwind CSS
- 状態管理: Redux
- データベース: PostgreSQL
- インフラ: AWS (SAM)
- コンテナ化: Docker
- テスト: Jest
- 開発ツール: Storybook

### アーキテクチャ
- フロントエンド: Next.jsアプリケーション
- バックエンド: AWS Lambda (SAM)
- データベース: AWS RDS (PostgreSQL)
- コンテナ化: Docker

## 2. パスごとの機能

### ルートパス (/)
- アプリケーションのメインページ
- `src/app/page.tsx`で定義
- 認証状態に応じて適切なページにリダイレクト
  - 未認証ユーザー → `/welcome`
  - 認証済みユーザー → `/app/image/view`

### 画像表示ページ (/app/image)
- 画像表示に関するページ
- 画像のビューワー機能を用意
- 認証済みユーザーのみアクセス可能

### チーム確認ページ (/app/team)
- チーム情報に関するページ
- 画像の表示と詳細情報の管理を行う
- 認証済みユーザーのみアクセス可能

### ドット絵エディタページ (/app/dot)
- 画像表示機能のメインページ
- 画像の表示と詳細情報の管理を行う
- 認証済みユーザーのみアクセス可能

### アナライズページ (/app/dot)
- 画像表示機能のメインページ
- 画像の表示と詳細情報の管理を行う
- 認証済みユーザーのみアクセス可能

### ウェルカムページ (/welcome)
- 新規ユーザー向けの初期設定ページ
- チーム作成やチーム参加の機能を提供
- 未認証ユーザーのみアクセス可能

### ヘルスチェックパス (/healthcheck)
- アプリケーションの健全性確認用エンドポイント
- `src/app/healthcheck/page.tsx`で定義
- コンテナのヘルスチェックに使用

### APIエンドポイント (/api)
- バックエンドとの通信を行うAPIエンドポイント群
- `src/app/api/`配下に定義
- RESTful APIを提供

### レイアウト
- アプリケーション全体のレイアウト定義
- `src/app/layout.tsx`で定義
- 共通のレイアウト要素を提供

### グローバルスタイル
- アプリケーション全体のスタイル定義
- `src/app/globals.css`で定義
- Tailwind CSSの設定を含む

### 画像表示エリア
- 選択された画像を表示
- 画像のサイズは最大高さ50vh、最大幅40vw
- 画像は中央揃えで表示
- 詳細表示の状態に応じて表示領域の幅が変更（詳細表示時は6カラム、非表示時は11カラム）

### 詳細表示エリア
- トグルボタンによる表示/非表示の切り替え
- 詳細表示時は6カラム、非表示時は1カラムの幅
- 左寄せで配置

## 3. プロジェクト構造

```
.
├── .aws-sam/              # AWS SAM関連
│   └── build/            # SAMビルド出力
├── .storybook/           # Storybook設定
├── aws/                  # AWS関連リソース
├── docs/                 # ドキュメント
├── src/                  # ソースコード
│   ├── app/             # Next.jsアプリケーションルート
│   │   ├── app/        # 認証済みユーザー向けページ
│   │   │   └── image/  # 画像関連機能
│   │   ├── welcome/    # 新規ユーザー向けページ
│   │   └── api/        # APIエンドポイント
│   ├── components/      # Reactコンポーネント
│   │   ├── atom/       # 最小単位のコンポーネント
│   │   ├── molecule/   # 複数のatomを組み合わせたコンポーネント
│   │   ├── organism/   # 複数のmoleculeを組み合わせたコンポーネント
│   │   └── template/   # ページレベルのコンポーネント
│   ├── hooks/          # カスタムフック
│   ├── store/          # Redux関連
│   └── types/          # 型定義
├── Dockerfile          # Docker設定
├── package.json        # 依存関係管理
├── template.yaml       # AWS SAMテンプレート
└── tailwind.config.ts  # Tailwind CSS設定
```

### 主要なコンポーネントの役割

#### アトム（最小単位）
- 基本的なUI要素（ボタン、テキスト、アイコンなど）

#### モレキュール（分子）
- `imgViewerTestCompOverRay`: 画像表示用のオーバーレイ機能を提供
- `noImageComponent`: 画像が選択されていない場合の表示

#### オーガニズム（有機体）
- `detailSubWindow`: 詳細情報の表示と制御を行うコンポーネント

#### テンプレート
- `appFront`: アプリケーション全体のレイアウトを管理
- `imageView`: 画像表示と詳細表示のレイアウトを管理

### 状態管理
- Reduxを使用して状態を管理
- `imageViewSlice`: 詳細表示の表示/非表示状態を管理
- `useDetailOpen`: 詳細表示の状態管理をカプセル化したカスタムフック

### 認証フロー
1. 未認証ユーザー
   - `/welcome`にリダイレクト
   - チーム作成またはチーム参加
   - 認証完了後`/app/image/view`にリダイレクト

2. 認証済みユーザー
   - 直接`/app/image/view`にリダイレクト
   - 画像表示機能にアクセス可能

## 4. デプロイメント

### ローカル開発環境
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### Docker環境
```bash
# イメージのビルド
docker build -t imageviewer2test-front .

# コンテナの起動
docker run -p 3030:3030 imageviewer2test-front
```

### AWSデプロイ
```bash
# SAMビルド
sam build

# SAMデプロイ
sam deploy
```

## 5. テスト

### ユニットテスト
```bash
npm test
```

### Storybook
```bash
npm run storybook
```
