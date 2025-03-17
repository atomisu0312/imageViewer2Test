# Echoバックエンド

これは、Echoフレームワークを使用して構築されたImage Viewerプロジェクトのバックエンドサービスです。

## はじめに

### 前提条件

- Go 1.18以上
- PostgreSQL

### インストール

1. リポジトリをクローンします:
    ```bash
    git clone https://github.com/your-repo/imageViewer2Test.git
    cd imageViewer2Test/backend/account
    ```

2. 依存関係をインストールします:
    ```bash
    go mod tidy
    ```

### データベースのセットアップ

1. PostgreSQLデータベースを作成し、`.env`ファイルにデータベースURLを更新します。

2. データベースマイグレーションを実行します:
    ```bash
    go run cmd/migrate/main.go
    ```

### サーバーの起動

Echoサーバーを起動します:
```bash
go run main.go
```

### テストの実行

テストを実行します:
```bash
go test ./...
```

## 詳細情報

Echoについての詳細は、以下のリソースを参照してください:

- [Echo ドキュメント](https://echo.labstack.com/guide) - Echoの機能とAPIについて学びます。

## 追加コマンド

- 別のポートでサーバーを実行する:
    ```bash
    go run main.go -port 8001
    ```

- requirements-dev.lockからrequirements.txtを生成する:
    ```bash
    sed '/^-e*/d' requirements-dev.lock > requirements.txt
    ```
