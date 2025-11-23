async function getPlaceIdFromLatLng(lat: number, lng: number): Promise<string | undefined> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;
  
  const res = await fetch(url);
  const data = await res.json();

  // 最初の結果のplace_idを返す
  if (data.results && data.results.length > 0) {
    return data.results[0].place_id;
  }
  return undefined;
}

function extractLatLngFromGoogleMapUrl(url: string): { lat: number, lng: number } | undefined {
  // パターン1: '@'の後ろ（例: .../@35.7105827,139.8114876,17z/...）
  const atPattern = /@([\-0-9.]+),([\-0-9.]+),/;
  const atMatch = url.match(atPattern);
  if (atMatch) {
    return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };
  }

  // パターン2: '!3d'と'!4d'（例: ...!3d35.7105827!4d139.8114876）
  const dPattern = /!3d([\-0-9.]+)!4d([\-0-9.]+)/;
  const dMatch = url.match(dPattern);
  if (dMatch) {
    return { lat: Number(dMatch[1]), lng: Number(dMatch[2]) };
  }

  return undefined;
}

export function extractPlaceIdFromGoogleMapsUrl(url: string): Promise<string | null> {
  // 省略URLの場合（maps.app.goo.gl等）はエラー扱い
  if (/maps\.app\.goo\.gl|goo\.gl\/maps/.test(url)) {
    return Promise.resolve(null); // 「不正なURL」として扱う
  }

  const latLng = extractLatLngFromGoogleMapUrl(url);
  if (latLng) {
    return getPlaceIdFromLatLng(latLng.lat, latLng.lng)
      .then(placeId => placeId || null)
      .catch(() => null); // エラー時もnullを返す
  }
  
    return Promise.resolve(null);  // 対応するパターンがなければ取得失敗
}