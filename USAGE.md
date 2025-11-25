# API Usage Guide

このドキュメントでは、`real-post` プロジェクトのAPIエンドポイントと認証クライアントの使用方法について説明します。

## 目次

- [認証クライアント (authClient)](#認証クライアント-authclient)
- [API エンドポイント](#api-エンドポイント)
  - [認証 (Auth)](#認証-auth)
  - [ユーザー (Users)](#ユーザー-users)
  - [企業 (Company)](#企業-company)
  - [アンケート (Surveys)](#アンケート-surveys)

---

## 認証クライアント (authClient)

`src/lib/auth-client.ts` は、フロントエンドから認証機能を利用するためのクライアントライブラリです。

### インポート

```typescript
import { authClient, signUp, getSessionWithProfile, updateCompanyProfile } from "@/lib/auth-client";
```

### メソッド

#### `useSession`

現在のセッション情報を取得するフックです。

```typescript
const { data: session, isPending, error } = authClient.useSession();
```

#### `signIn`

サインインを行います。

```typescript
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});
```

#### `signOut`

サインアウトを行います。

```typescript
await authClient.signOut();
```

#### `signUp`

新規ユーザー登録を行います。

```typescript
await signUp({
  email: "user@example.com",
  password: "password123",
  accountType: "user", // または "company"
  companyName: "My Company", // accountTypeが "company" の場合必須
});
```

#### `getSessionWithProfile`

プロフィール情報を含むセッション情報を取得します。

```typescript
const sessionWithProfile = await getSessionWithProfile();
```

#### `updateCompanyProfile`

企業プロフィールを更新します。

```typescript
await updateCompanyProfile({
  companyName: "New Company Name",
  companyCategory: "food", // "food" | "culture" | "activity" | "shopping" | "other"
});
```

---

## API エンドポイント

全てのAPIは `/api` プレフィックスで始まります。

### 認証 (Auth)

#### `POST /api/auth/signup`

新規ユーザーを作成します。

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `email` (string, required): メールアドレス
  - `password` (string, required): パスワード
  - `accountType` (string, required): `"user"` または `"company"`
  - `image` (File, optional): プロフィール画像
  - `companyName` (string): 企業名 (`accountType="company"` の場合必須)
  - `companyCategory` (string): 企業カテゴリ (`accountType="company"` の場合必須)
    - 値: `"food"`, `"culture"`, `"activity"`, `"shopping"`, `"other"`

#### `GET /api/auth/me`

現在のユーザーセッションとプロフィール情報を取得します。

- **Headers**: Cookie (セッション)
- **Response**:
  ```json
  {
    "user": { ... },
    "profile": { ... }, // userProfile または companyProfile
    "accountType": "user" | "company"
  }
  ```

#### `PATCH /api/auth/me`

現在のユーザーまたは企業のプロフィールを更新します。

- **Headers**: Cookie (セッション)
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name` (string, optional): ユーザー名
  - `image` (File, optional): プロフィール画像
  - `companyName` (string, optional): 企業名 (企業アカウントのみ)
  - `companyCategory` (string, optional): 企業カテゴリ (企業アカウントのみ)

---

### ユーザー (Users)

#### `GET /api/users/favorite`

ログイン中のユーザーのお気に入りアンケート一覧を取得します。

- **Headers**: Cookie (ユーザーアカウント必須)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Favorites fetched successfully",
    "data": [
      {
        "id": "favorite_id",
        "survey": { ... } // アンケート詳細
      }
    ]
  }
  ```

---

### 企業 (Company)

#### `GET /api/company/[id]`

指定したIDの企業プロフィールを取得します。

- **Params**: `id` (User ID of the company)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "profile_id",
      "companyName": "...",
      "companyCategory": "...",
      "image": "...", // ユーザーテーブルの画像URL
      ...
    }
  }
  ```

---

### アンケート (Surveys)

#### `GET /api/surveys`

アンケート一覧を取得します。フィルタリングとページネーションが可能です。

- **Query Params**:
  - `page` (number, default: 1): ページ番号
  - `limit` (number, default: 10): 1ページあたりの件数
  - `category` (string | string[]): 企業カテゴリでフィルタ。複数指定をサポートします（繰り返しパラメータ `?category=a&category=b` または カンマ区切り `?category=a,b`）。
  - `query` (string | string[]): 説明文(description)の部分一致検索。複数ワードを指定した場合は OR 検索（いずれかに部分一致）になります。繰り返し / カンマ区切りをサポートします。
  - `age_group` (string | string[]): 年齢層フィルタ。複数指定をサポートします。
  - `country` (string | string[]): 国フィルタ。複数指定をサポートします。
  - `gender` (string | string[]): 性別フィルタ (`male`, `female`, `other`)。複数指定をサポートします。
- **Response**:

  ```json
  {
    "success": true,
    "data": [
      {
        "companyId": "company_user_id",
        "id": "survey_id",
        "description": "...",
        "thumbnailUrl": "...", // 最初の画像または企業画像
        "imageUrls": ["url1", "url2"], // 関連画像一覧（フィールド名は `imageUrls`）
        "isFavorited": boolean, // ログインユーザーがお気に入りにしているか
        ...
      }
    ]
  }
  ```

#### `GET /api/surveys/unique-per-company`

各企業ごとの最新のアンケートを1件ずつ取得します。

- **Query Params**: `GET /api/surveys` と同様
- **Response**: `GET /api/surveys` と同様の形式
- **備考（ページング）**: クエリフィルタが一切指定されていない場合はサーバー側で一旦全件を取得して社別に並べ替え（同一会社が連続しないように調整）を行った後に `page`/`limit` によるスライスを適用します。フィルタが指定されている場合は DB 側で `limit`/`offset` を使って効率的に取得します。

#### `GET /api/surveys/[id]`

特定のアンケートの詳細を取得します。

- **Params**: `id` (Survey ID)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "survey_id",
      ...
    }
  }
  ```

#### `GET /api/surveys/company/[id]`

特定の企業のアンケート一覧を取得します。

- **Params**: `id` (Company User ID)
- **Response**:
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```

#### `POST /api/surveys/company/[id]`

新規アンケートを作成します（トークン認証が必要）。

- **Params**: `id` (Company User ID)
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `description` (string, required)
  - `gender` (string, required): `"male"`, `"female"`, `"other"`
  - `ageGroup` (string, required): `"18-24"`, `"25-34"`, etc.
  - `satisfactionLevel` (number, required): 1-5
  - `country` (string, required)
  - `images` (File[], optional): 複数画像アップロード可能
- **Response**:
  ```json
  {
    "success": true,
    "message": "Survey created successfully"
  }
  ```

#### `POST /api/surveys/token`

アンケート回答用のトークンを発行します（企業アカウントのみ）。

- **Headers**: Cookie (企業アカウント必須)
- **Body**:
  ```json
  {
    "maxUses": 10 // トークンの最大使用回数
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "token": "generated_token_string"
    }
  }
  ```

#### `GET /api/surveys/token`

トークンの有効性を検証します。

- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `company_id` (必須)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token is valid"
  }
  ```

#### `GET /api/surveys/[id]/favorite`

特定のアンケートに対するお気に入り情報を取得します。

- **Params**: `id` (Survey ID)
- **Response**:
  ```json
  {
    "success": true,
    "data": [ ... ] // お気に入りレコードの配列
  }
  ```

#### `PATCH /api/surveys/[id]/favorite`

アンケートのお気に入り状態を切り替えます（トグル）。

- **Params**: `id` (Survey ID)
- **Headers**: Cookie (ユーザーアカウント必須)
- **Body**: 空のJSON `{}` または `{ "isFavorite": boolean }` (現状の実装ではトグル動作が主)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Favorite toggled"
  }
  ```
