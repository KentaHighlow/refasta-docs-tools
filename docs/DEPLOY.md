# DEPLOY: Refasta 社内 Editor Add-on としての公開手順

> 主語: Sugi（または委任した DS 部門担当者）
> 期限の目安: 初回構築 60〜90 分（Google 側の反映遅延を含む。要確認）
> 完了時の状態: 社内ユーザーが「拡張機能 → アドオン → 便利ツール by Sugi」をクリックでき、メニューからスクリプトが実行できる

本ドキュメントは画面遷移を端折らず一度で示す。Advanced Service / OAuth スコープ / 初回認証 / 想定エラー対処まで一括明示する（Org policy 25）。

---

## 0. 全体マップ

```
GitHub clone → clasp login → Apps Script 作成 → src/ を push
        │
        ├── GCP プロジェクト作成 → Marketplace SDK 有効化
        │                          OAuth Consent Screen = Internal
        │
        ├── Apps Script を GCP に紐付け（standard GCP）
        │
        ├── Apps Script で「テスト用デプロイ」→ 自分で動作確認
        │
        ├── Apps Script で「バージョン作成」→ デプロイ ID 発行
        │
        └── Marketplace SDK App Configuration → Publish (Domain Install)
                            ↓
            Workspace Admin（管理コンソール）で「アプリを承認」
                            ↓
            社内ユーザーがドキュメントから利用可能
```

---

## 1. 前提条件（要確認）

| 項目 | 想定値 | 確認方法 |
|---|---|---|
| Google Workspace ドメイン | urlounge.co.jp | admin.google.com にログイン |
| 実行アカウント | sugi@urlounge.co.jp（管理者権限推奨） | — |
| `node` / `npm` | v18 以上 | `node -v` |
| `git` | 任意のバージョン | `git --version` |

---

## 2. Apps Script プロジェクトを作成し、ソースを push

```bash
# 1) リポジトリを取得
git clone https://github.com/★OWNER★/refasta-docs-tools.git
cd refasta-docs-tools
npm install

# 2) clasp ログイン（urlounge.co.jp アカウントで）
npx clasp login

# 3) Standalone な Apps Script プロジェクトを新規作成
npx clasp create --type standalone --title "便利ツール by Sugi" --rootDir ./src

# 上記で .clasp.json が生成される。以後、.clasp.json は .gitignore 済み。

# 4) src/ を push
npx clasp push
```

想定エラー:
- `User has not enabled the Apps Script API` → https://script.google.com/home/usersettings で API を ON
- `Push failed: appsscript.json mismatch` → `clasp pull --force` で初期化してから再 push

---

## 3. GCP プロジェクトを作成し、Apps Script に紐付ける

### 3-1. GCP プロジェクト作成

1. https://console.cloud.google.com/projectcreate を開く
2. プロジェクト名: `refasta-docs-tools`
3. 組織: `urlounge.co.jp` を選択
4. 「作成」

### 3-2. 必要 API を有効化

`API ライブラリ` で以下を有効化:

- Google Workspace Marketplace SDK
- Apps Script API

### 3-3. OAuth Consent Screen を Internal に設定

1. `APIs & Services → OAuth consent screen`
2. **User Type: Internal** を選択（urlounge.co.jp ドメインのみで利用するため、ブランド検証や OAuth verification は不要）
3. アプリ名: `便利ツール by Sugi`
4. ユーザーサポートメール: `sugi@urlounge.co.jp`
5. アプリのロゴ: 任意（後から差し替え可）
6. アプリのドメイン: `urlounge.co.jp`
7. デベロッパー連絡先: `sugi@urlounge.co.jp`
8. スコープ:
   - `https://www.googleapis.com/auth/documents.currentonly`
   - `https://www.googleapis.com/auth/script.container.ui`
9. 保存

### 3-4. Apps Script から GCP プロジェクトを紐付け

1. `npx clasp open` で Apps Script Editor を開く
2. 左サイド「⚙ プロジェクトの設定」
3. 「Google Cloud Platform（GCP）プロジェクト」セクションの **プロジェクトを変更**
4. GCP コンソール `IAM & Admin → Settings` で表示される **プロジェクト番号** を貼り付け
5. 「プロジェクトを設定」

---

## 4. Marketplace SDK を構成する

### 4-1. App Configuration

`APIs & Services → Enabled APIs → Google Workspace Marketplace SDK → App Configuration`

| 項目 | 値 |
|---|---|
| App visibility | **Private (urlounge.co.jp のみ)** |
| Installation Settings | **Admin Only Install** または **Individual + Admin Install**（要確認: 社内ポリシーに従う） |
| App Integration | Editor Add-on にチェック |
| Docs add-on script ID | `npx clasp open` で確認できるスクリプト ID |
| Docs add-on version | 「5. バージョン作成」で発行する値（後述） |
| OAuth scopes | 上記 3-3 と同一 |

### 4-2. Store Listing

| 項目 | 値 |
|---|---|
| アプリ名 | 便利ツール by Sugi |
| 短い説明 | Markdown 太字変換 / 見出しレベル繰り上げ |
| 詳細説明 | README の概要をコピー |
| アイコン (96x96 / 128x128) | `assets/icon.png`（後で追加） |
| カテゴリ | Productivity |
| 言語 | 日本語 |
| サポート URL | GitHub リポジトリの Issues |
| プライバシーポリシー URL | `https://github.com/★OWNER★/refasta-docs-tools/blob/main/PRIVACY.md`（後で作成） |
| 利用規約 URL | 同上 `TERMS.md`（後で作成） |

> プライバシーポリシー / 利用規約は **Internal 配布でも入力必須**。簡易テンプレで OK（要確認: 法務確認推奨）。

---

## 5. Apps Script で「テスト用デプロイ」と「バージョン作成」

### 5-1. テスト用デプロイ（自分の Doc で動作確認）

1. Apps Script Editor → 右上 **デプロイ → テストデプロイをテスト**
2. 「アプリケーションタイプ: Editor Add-on」
3. ドキュメントを選択（任意の自分のドキュメント）
4. 開いたドキュメントで `拡張機能 → アドオン → 便利ツール by Sugi（Test）` を確認
5. 各メニュー項目を押して動作確認

想定エラー:
- メニューが出ない → ブラウザリロード、または Apps Script 側で `onOpen` を手動実行して権限承認
- 権限エラー → OAuth consent screen のスコープ設定を再確認

### 5-2. バージョン作成

1. Apps Script Editor → **デプロイ → 新しいデプロイ**
2. 種類: Editor Add-on
3. バージョン: 「新しいバージョン」`1.0.0 - initial release`
4. 「デプロイ」
5. 表示される **デプロイ ID** をコピーし、4-1 のフォームに貼り付ける

---

## 6. Marketplace SDK で Publish

1. Marketplace SDK の App Configuration 画面で **PUBLISH** ボタン
2. 反映には数分〜数時間（要確認: Google 側仕様）

---

## 7. Workspace Admin で「組織内アプリを承認」

1. https://admin.google.com にログイン（管理者権限が必要）
2. `アプリ → Google Workspace Marketplace アプリ → アプリを追加 → 組織のアプリ`
3. `便利ツール by Sugi` を検索
4. 「インストール」→「全員に対して有効」
5. OAuth スコープを確認 → 承認

---

## 8. 社内ユーザーへの周知（チャット文例）

> Refasta社内で使える「便利ツール by Sugi」を Google ドキュメント Add-on として公式化しました。
> 任意のドキュメントで `拡張機能 → アドオン → 便利ツール by Sugi` から利用できます。
> 機能: ① Markdown 太字変換 ② 見出しレベル繰り上げ。
> 不具合・要望は GitHub Issues へ → https://github.com/★OWNER★/refasta-docs-tools/issues

---

## 9. 想定エラーと対処

| エラー | 原因 | 対処 |
|---|---|---|
| `App not verified` ダイアログ | OAuth consent screen が External | Internal に切り替え |
| 社内ユーザーに表示されない | Marketplace SDK が Public 設定 | Visibility を Private に |
| `Authorization required` ループ | scope ズレ | appsscript.json と OAuth consent screen を一致させる |
| メニューが出ない | onOpen が AuthMode.NONE で失敗 | createMenu ではなく **createAddonMenu** を使う（本リポジトリは対応済み） |

---

## 10. 監査・ログ

- `clasp logs --watch` でリアルタイムログ
- GCP の `Logs Explorer` でユーザー単位の実行履歴を確認
- Org policy 18 準拠（顧客データを扱わないツールだが、運用上は監視を維持）

