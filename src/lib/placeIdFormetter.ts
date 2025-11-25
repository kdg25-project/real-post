export function extractPlaceIdFromGoogleMapsUrl(url: string): string | null {
  // 省略URLの場合（maps.app.goo.gl等）はエラー扱い
  if (/maps\.app\.goo\.gl|goo\.gl\/maps/.test(url)) {
    return null; // 「不正なURL」として扱う
  }
  // !1s の後に現れる16進数:区切りデータがplaceId
  const match = url.match(/!1s([0-9a-fx:]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  // または /16s%2Fg%2F 形式の場合（google短縮ID）
  const matchAlt = url.match(/16s%2Fg%2F([a-zA-Z0-9_]+)/);
  if (matchAlt && matchAlt[1]) {
    return `/g/${matchAlt[1]}`;
  }
  return null; // 対応するパターンがなければ取得失敗
}
