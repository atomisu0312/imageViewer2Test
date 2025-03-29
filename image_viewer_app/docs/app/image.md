# 画像表示機能

## 概要
画像の表示と管理を行う機能です。画像のアップロード、表示、基本情報の確認が可能です。

## パス
- メインページ: `/app/image`
- 詳細表示: `/app/image/view`

## 機能仕様

### 画像表示エリア
- 最大表示サイズ: 画面の80%幅
- アスペクト比: 16:9（動画表示用）
- 画像の中央揃え表示
- ズーム機能（予定）
- パン機能（予定）

### 画像情報表示
- ファイル名
- 画像サイズ（幅×高さ）
- アップロード日時
- ファイル形式
- ファイルサイズ

### 操作機能
- 画像のアップロード
- 画像の削除
- 画像の編集（予定）
- 画像の共有（予定）

## 技術仕様

### コンポーネント構成
- `ImagePage`: メインページコンポーネント
- `ImageView`: 画像表示コンポーネント
- `ImageInfo`: 画像情報表示コンポーネント

### データ構造
```typescript
interface ImageInfo {
  id: string;
  filename: string;
  width: number;
  height: number;
  uploadDate: Date;
  fileType: string;
  fileSize: number;
  url: string;
}
```

### APIエンドポイント
- `GET /api/images`: 画像一覧の取得
- `POST /api/images`: 新規画像のアップロード
- `GET /api/images/:id`: 特定画像の情報取得
- `DELETE /api/images/:id`: 画像の削除

## 制限事項
- 対応フォーマット: JPG, PNG, GIF
- 最大ファイルサイズ: 10MB
- 最大解像度: 4096x4096 