# チーム機能

## 概要
チームの作成、管理、メンバー管理を行う機能です。チーム単位での画像共有や編集権限の管理が可能です。

## パス
- メインページ: `/app/team`
- チーム詳細: `/app/team/[id]`

## 機能仕様

### チーム情報表示
- チーム名
- チーム作成日
- メンバー一覧
  - アバター画像
  - ユーザー名
  - ロール（管理者/メンバー）
- チーム設定
  - プライバシー設定
  - 招待コード

### メンバー管理
- メンバーの追加
- メンバーの削除
- ロールの変更
- 招待コードの生成
- 招待コードによる参加

### チーム管理
- チームの作成
- チームの削除
- チーム名の変更
- チーム設定の変更

## 技術仕様

### コンポーネント構成
- `TeamPage`: メインページコンポーネント
- `TeamInfo`: チーム情報表示コンポーネント
- `MemberList`: メンバー一覧コンポーネント
- `TeamSettings`: チーム設定コンポーネント

### データ構造
```typescript
interface Team {
  id: string;
  name: string;
  createdAt: Date;
  members: Member[];
  settings: TeamSettings;
  inviteCode: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

interface TeamSettings {
  privacy: 'public' | 'private';
  allowInvites: boolean;
  maxMembers: number;
}
```

### APIエンドポイント
- `GET /api/teams`: チーム一覧の取得
- `POST /api/teams`: 新規チームの作成
- `GET /api/teams/:id`: 特定チームの情報取得
- `PUT /api/teams/:id`: チーム情報の更新
- `DELETE /api/teams/:id`: チームの削除
- `POST /api/teams/:id/members`: メンバーの追加
- `DELETE /api/teams/:id/members/:memberId`: メンバーの削除

## 制限事項
- 1ユーザーあたりの最大チーム数: 5
- 1チームあたりの最大メンバー数: 20
- 招待コードの有効期限: 7日間 