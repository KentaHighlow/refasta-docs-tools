# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-03

### Added
- 初版リリース。Container-bound 版の GAS を Editor Add-on 仕様に移植
- メニュー「Markdown太字を変換 (**文字**)」
- メニュー「見出しレベルを上げる (H2→H1...)」
- メニュー「バージョン情報」
- Refasta（urlounge.co.jp）社内向け Marketplace 配布構成
- GitHub リポジトリ `refasta-docs-tools` 公式スレッド開設

### Changed
- `createMenu` → `createAddonMenu`（Add-on 仕様）
- `onInstall` トリガー追加
- 見出し変換ロジックを map 駆動にリファクタリング

### Security
- OAuth スコープを最小化（`documents.currentonly` / `script.container.ui` のみ）

## [Unreleased]

### Changed
- リポジトリ Visibility を Private → **Public** に変更（社内 GitHub 普及と公式蓄積地点としての性格強化）
- ドキュメント類の Visibility 表記を Public に統一
