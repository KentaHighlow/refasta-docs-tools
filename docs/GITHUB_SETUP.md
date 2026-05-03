# GITHUB_SETUP: refasta-docs-tools リポジトリ立ち上げ手順

> 主語: Sugi（または委任した DS 部門担当者）
> 期限の目安: 10〜15 分
> 完了時の状態:
>   - https://github.com/★OWNER★/refasta-docs-tools が Public で存在
>   - main ブランチに本リポジトリの全ファイルがコミット済み
>   - Issue/PR テンプレ・ブランチ保護・リリースフローが稼働

本書は「公式スレ（=Issues + Discussions）」を将来の便利ツールの蓄積地点とすることを意図する。

---

## 0. 全体マップ

```
GitHub アカウント決定 → リポジトリ作成 → ローカルから push
                                │
                                ├── ブランチ保護（main へ直 push 禁止）
                                ├── Discussions を有効化（公式スレッド）
                                ├── Issue/PR テンプレ反映
                                └── 初回 Release タグ v1.0.0 作成
```

---

## 1. アカウントとリポジトリ名の決定

| 項目 | 推奨 | 備考 |
|---|---|---|
| Owner | `urlounge`（Organization）または `sugi-official` | Refasta 名義で蓄積するなら Organization 推奨 |
| リポジトリ名 | `refasta-docs-tools` | 確定 |
| Visibility | Public | 確定 |
| ライセンス | MIT | 既に LICENSE 配置済み |

> Organization が存在しない場合は GitHub にログイン → 右上 `+` → New organization で `urlounge`（または相当名）を作成。Refasta の商標・ドメイン情報を入れる（Org policy 4: 実在しうる法人情報の創作禁止に注意）。

---

## 2-A. gh CLI で作成する場合（推奨・最速）

```bash
# 0) gh が未インストールなら https://cli.github.com からインストール

# 1) 認証
gh auth login
#   → GitHub.com → HTTPS → Login with a web browser

# 2) リポジトリ作成 + 初回 push（カレントが refasta-docs-tools）
cd C:/Users/USER/Documents/Claude/Projects/sugiOfficialGASCreateProject

# 既存ファイルを git 管理下に
git init -b main
git add .
git commit -m "feat: initial commit - 便利ツール by Sugi v1.0.0"

# Public で作成し remote を設定し push
gh repo create refasta-docs-tools \
  --public \
  --description "便利ツール by Sugi - Refasta社内向け Google ドキュメント Editor Add-on" \
  --source . \
  --remote origin \
  --push

# 3) Discussions を有効化（公式スレッド用）
gh repo edit --enable-discussions

# 4) main ブランチ保護
gh api repos/:owner/:repo/branches/main/protection \
  -X PUT \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F enforce_admins=false \
  -F required_status_checks=null \
  -F restrictions=null
```

---

## 2-B. git CLI のみで作成する場合

```bash
# 1) Web で空リポジトリを作成
#    https://github.com/new
#    Name: refasta-docs-tools
#    Visibility: Public
#    "Add a README" などはチェックしない（既にローカルにあるため）

# 2) ローカルから push
cd C:/Users/USER/Documents/Claude/Projects/sugiOfficialGASCreateProject
git init -b main
git add .
git commit -m "feat: initial commit - 便利ツール by Sugi v1.0.0"
git remote add origin https://github.com/★OWNER★/refasta-docs-tools.git
git push -u origin main

# 3) GitHub Web UI で Settings → Features → Discussions を ON
# 4) Settings → Branches → Add rule → main → Require pull request reviews
```

---

## 3. 公式スレッド（Discussions）を立ち上げる

GitHub Web UI:
1. Discussions タブ → New discussion
2. カテゴリ: `Announcements`
3. タイトル: `📌 便利ツール by Sugi - 公式スレッド（要望・進捗・新ツール提案）`
4. 本文（テンプレ）:

```markdown
このリポジトリは Refasta 社内向け Google ドキュメント便利ツールの公式蓄積地点です。

## 用途
- ✅ 機能追加の要望
- ✅ バグ報告（再現手順を添えて）
- ✅ 新しいツールアイデアの提案
- ✅ 業務での活用事例の共有

## ルール
- 顧客の個人情報は絶対に貼らない（Refasta Org policy 8）
- バグはまず Issues に立てる。Discussions は議論用
- 要望は OGISM(A) を意識して「目的・目標・期限」を書く

## ロードマップ（予定）
- v1.0.0 ✅ Markdown 太字変換 / 見出しレベル繰り上げ
- v1.1.0 - 表ツール（行列入れ替え・ソート）
- v1.2.0 - Markdown フル変換（h# / リスト / コードブロック）
- v2.0.0 - Sheets / Slides 拡張
```

---

## 4. Issue / PR テンプレを配置

`.github/` 配下に既に同梱済み。コミットすれば即有効化。

---

## 5. 初回リリースタグを切る

```bash
gh release create v1.0.0 \
  --title "v1.0.0 - 便利ツール by Sugi 初版" \
  --notes "Markdown 太字変換 / 見出しレベル繰り上げの 2 機能。社内 Editor Add-on として配布開始。"
```

または Web UI で `Releases → Draft a new release → Tag: v1.0.0`。

---

## 6. 今後のコミット粒度ルール（Refasta 内規 / Org policy 16-17 準拠）

- 1 PR = 1 機能 = 最小コミット粒度
- main に直 push 禁止（ブランチ保護で強制）
- レビュー 1 名以上必須
- バイブコーディング禁止（型・入力検証・エラーログを省略しない）
- AI が生成したコードは Apps Script の `テストデプロイ` で人間が動作確認してから merge

---

## 7. 想定エラーと対処

| エラー | 原因 | 対処 |
|---|---|---|
| `gh: command not found` | gh CLI 未インストール | https://cli.github.com からインストール |
| `Permission denied (publickey)` | SSH 鍵未登録 | HTTPS で push するか SSH 鍵を GitHub に登録 |
| `repository name already exists` | 同名リポジトリが既存 | 別名にするか既存を削除 |
| Discussions タブが出ない | 設定未反映 | Settings → General → Features → Discussions チェック |
