# 分析機能

## 概要
画像の分析と統計情報の表示を行う機能です。画像の特徴やパターンを解析し、視覚的なデータを提供します。

## パス
- メインページ: `/app/analyze`
- 分析結果ページ: `/app/analyze/[id]`

## 機能仕様

### 画像分析
- 色の分析
  - カラーパレット抽出
  - 色の分布グラフ
  - 主要な色の特定
- 構図分析
  - 三分割法による構図評価
  - 重心位置の特定
  - 対称性の分析
- テクスチャ分析
  - パターンの検出
  - テクスチャの特徴抽出
  - 類似パターンの検索

### 統計情報
- 画像サイズ
- ファイル形式
- 作成日時
- 編集履歴
- 使用頻度

### レポート生成
- 分析結果のサマリー
- グラフとチャート
- 改善提案
- PDFエクスポート

## 技術仕様

### コンポーネント構成
- `AnalyzePage`: メインページコンポーネント
- `AnalysisResult`: 分析結果表示コンポーネント
- `ColorAnalysis`: 色分析コンポーネント
- `CompositionAnalysis`: 構図分析コンポーネント
- `TextureAnalysis`: テクスチャ分析コンポーネント
- `StatisticsPanel`: 統計情報パネルコンポーネント

### データ構造
```typescript
interface Analysis {
  id: string;
  imageId: string;
  colorAnalysis: ColorAnalysis;
  compositionAnalysis: CompositionAnalysis;
  textureAnalysis: TextureAnalysis;
  statistics: Statistics;
  createdAt: Date;
}

interface ColorAnalysis {
  palette: Color[];
  distribution: ColorDistribution;
  dominantColors: Color[];
}

interface CompositionAnalysis {
  ruleOfThirds: RuleOfThirdsResult;
  centerOfGravity: Point;
  symmetry: SymmetryResult;
}

interface TextureAnalysis {
  patterns: Pattern[];
  features: TextureFeature[];
  similarPatterns: Pattern[];
}

interface Statistics {
  size: number;
  format: string;
  createdAt: Date;
  lastModified: Date;
  usageCount: number;
}
```

### APIエンドポイント
- `GET /api/analysis`: 分析結果一覧の取得
- `POST /api/analysis`: 新規分析の実行
- `GET /api/analysis/:id`: 特定の分析結果の取得
- `DELETE /api/analysis/:id`: 分析結果の削除
- `POST /api/analysis/:id/export`: 分析レポートのエクスポート

## 制限事項
- 分析可能な最大画像サイズ: 5000x5000ピクセル
- 分析処理の最大時間: 30秒
- 保存可能な分析結果数: 100件
- エクスポート可能な形式: PDF, CSV 