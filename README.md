# refasta-docs-tools

> 便利ツール by Sugi — Google ドキュメント用 Editor Add-on
> Refasta（urlounge.co.jp）社内配布の公式 Add-on リポジトリ
> Visibility: **Private**（Refasta 関係者のみ）

## 概要

毎回 GAS をコピペして使っていた「Markdown 太字変換 / 見出しレベル繰り上げ」スクリプトを、
Google ドキュメントの **Editor Add-on** として一元配布する。社内ユーザーは
ドキュメントの「拡張機能 → アドオン」から本ツールを有効化するだけで、すべてのドキュメントで利用できる。

## 機能

| メニュー項目 | 機能 |
|---|---|
| `Markdown太字を変換 (**文字**)` | `**文字**` を検索して太字に変換、`**` を削除 |
| `見出しレベルを上げる (H2→H1...)` | 全段落の見出しレベルを1段階上げる（H1 は不変） |
| `バージョン情報` | Add-on バージョン・著者を表示 |

## ディレクトリ構成

```
refasta-docs-tools/
├── src/
│   ├── Code.gs          # メインスクリプト（Editor Add-on 仕様）
│   └── appsscript.json  # マニフェスト
├── docs/
│   ├── DEPLOY.md        # Add-on を Refasta 社内に公開する手順
│   └── GITHUB_SETUP.md  # GitHub リポジトリ立ち上げ手順
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── .clasp.json.example  # clasp 設定のテンプレート（実物は .gitignore）
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── package.json         # clasp デプロイ用 npm scripts
└── README.md
```

## 開発フロー

### 1. ローカルセットアップ

```bash
git clone https://github.com/KentaHighlow/refasta-docs-tools.git
cd refasta-docs-tools
npm install
npx clasp login          # urlounge.co.jp の Google アカウントで
cp .clasp.json.example .clasp.json
# .clasp.json の scriptId を Apps Script プロジェクト ID に置き換え
```

### 2. Apps Script への push

```bash
npm run push             # src/ → Apps Script
npm run open             # ブラウザで Apps Script Editor を開く
```

### 3. デプロイ

社内 Add-on としての公開手順は [`docs/DEPLOY.md`](docs/DEPLOY.md) を参照。

## コミット粒度ルール（Refasta 内規）

- 「作っては壊す」前提でコミット粒度は最小、ロールバック可能性を担保（Org policy 16）
- レビュー無しの本番反映禁止（Org policy 17）
- 1 機能 = 1 PR を原則とし、PR テンプレに動作確認結果を記載

## ライセンス

MIT — 詳細は [`LICENSE`](LICENSE) を参照

## 著者

Kentaro Sugi（杉 兼太朗）/ ラウンジデザイナーズ株式会社（Refasta）
