/**
 * 便利ツール by Sugi - Refasta Docs Add-on
 *
 * 役割: Google ドキュメントに「便利ツール by Sugi」メニューを追加し、
 *       Markdown 太字変換・見出しレベルの繰り上げを実行する。
 * 配布: Refasta（urlounge.co.jp）社内 Editor Add-on として配布。
 * ライセンス: MIT
 *
 * 改変履歴:
 *   v1.0.0  Container-bound 版を Editor Add-on 仕様に移植（onInstall / createAddonMenu）
 */

var ADDON_TITLE = '便利ツール by Sugi';
var VERSION = '1.0.0';

/**
 * ドキュメントを開いた時に呼ばれるトリガー（Editor Add-on 仕様）
 * AuthMode.NONE でも安全にメニューだけ追加できるよう createAddonMenu を使用。
 *
 * @param {GoogleAppsScript.Events.DocsOnOpen} e
 */
function onOpen(e) {
  var ui = DocumentApp.getUi();
  ui.createAddonMenu()
    .addItem('Markdown太字を変換 (**文字**)', 'convertMarkdownBold')
    .addSeparator()
    .addItem('見出しレベルを上げる (H2→H1...)', 'promoteHeadings')
    .addSeparator()
    .addItem('バージョン情報', 'showAbout')
    .addToUi();
}

/**
 * Add-on をインストールした時に呼ばれる。AuthMode.FULL 相当を要求しないため
 * 単純に onOpen を再利用する（Google 推奨パターン）。
 *
 * @param {GoogleAppsScript.Events.AddonOnInstall} e
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * **テキスト** を検索し、太字にしてから ** を削除する
 */
function convertMarkdownBold() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var pattern = '\\*\\*[^*]+\\*\\*';
  var found = body.findText(pattern);
  var converted = 0;

  while (found) {
    var element = found.getElement().asText();
    var startOffset = found.getStartOffset();
    var endOffset = found.getEndOffsetInclusive();

    // 中身を太字化 → 末尾の ** を削除 → 先頭の ** を削除
    element.setBold(startOffset + 2, endOffset - 2, true);
    element.deleteText(endOffset - 1, endOffset);
    element.deleteText(startOffset, startOffset + 1);

    converted++;
    found = body.findText(pattern, found);
  }

  DocumentApp.getUi().alert(
    converted > 0
      ? converted + ' 箇所の **太字** を変換しました。'
      : '対象となる **テキスト** が見つかりませんでした。'
  );
}

/**
 * 見出しレベルを 1 つ上のレイヤーに上げる（H1 はそのまま）
 * H2→H1, H3→H2, H4→H3, H5→H4, H6→H5
 */
function promoteHeadings() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paragraphs = body.getParagraphs();
  var H = DocumentApp.ParagraphHeading;
  var promotionMap = [
    { from: H.HEADING6, to: H.HEADING5 },
    { from: H.HEADING5, to: H.HEADING4 },
    { from: H.HEADING4, to: H.HEADING3 },
    { from: H.HEADING3, to: H.HEADING2 },
    { from: H.HEADING2, to: H.HEADING1 }
  ];

  var count = 0;
  for (var i = 0; i < paragraphs.length; i++) {
    var p = paragraphs[i];
    var current = p.getHeading();
    for (var j = 0; j < promotionMap.length; j++) {
      if (current === promotionMap[j].from) {
        p.setHeading(promotionMap[j].to);
        count++;
        break;
      }
    }
  }

  DocumentApp.getUi().alert(
    count > 0
      ? count + ' 箇所の見出しレベルを上げました。'
      : '変更対象となる見出しが見つかりませんでした。'
  );
}

/**
 * バージョン情報ダイアログ
 */
function showAbout() {
  DocumentApp.getUi().alert(
    ADDON_TITLE + '\n' +
    'Version: ' + VERSION + '\n' +
    'Author: Kentaro Sugi (Refasta)\n' +
    'License: MIT'
  );
}
