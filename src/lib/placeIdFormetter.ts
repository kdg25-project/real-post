async function getPlaceIdFromLatLng(lat: number, lng: number): Promise<string | undefined> {
  const key =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
    process.env.GOOGLE_MAPS_KEY ||
    process.env.NEXT_GOOGLE_MAPS_KEY;
  if (!key) {
    // APIキーがない場合は外部呼び出しを行わない
    return undefined;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();

  // 最初の結果のplace_idを返す
  if (data && data.results && data.results.length > 0) {
    return data.results[0].place_id;
  }
  return undefined;
}

function extractLatLngFromGoogleMapUrl(url: string): { lat: number; lng: number } | undefined {
  // パターン1: '@'の後ろ（例: .../@35.1682906,136.8737418,3355m/...）
  // ユーザー指定の正規表現を使用
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    console.log("Extracted lat/lng from @ pattern:", atMatch[1], atMatch[2]);
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  // パターン2: '!3d'と'!4d'（例: ...!3d35.7105827!4d139.8114876）
  // ピンの位置
  const dPattern = /!3d([\-0-9.]+)!4d([\-0-9.]+)/;
  const dMatch = url.match(dPattern);
  if (dMatch) {
    console.log("Extracted lat/lng from !3d/!4d pattern:", dMatch[1], dMatch[2]);
    return { lat: Number(dMatch[1]), lng: Number(dMatch[2]) };
  }

  return undefined;
}

export function extractPlaceIdFromGoogleMapsUrl(url: string): Promise<string | null> {
  // 省略URLの場合（maps.app.goo.gl等）はエラー扱い
  if (/maps\.app\.goo\.gl|goo\.gl\/maps/.test(url)) {
    console.log("Unsupported shortened URL:", url);
    return Promise.resolve(null); // 「不正なURL」として扱う
  }

  const latLng = extractLatLngFromGoogleMapUrl(url);
  if (latLng) {
    // まず可能ならPlace IDを取得する。APIキーが無ければ座標をフォールバックとして返す。
    const key =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
      process.env.GOOGLE_MAPS_KEY ||
      process.env.NEXT_GOOGLE_MAPS_KEY;
    if (!key) {
      console.warn("Google Maps API key not found; returning lat,lng string as fallback.");
      const coordString = `${latLng.lat},${latLng.lng}`;
      console.log("Extracted lat/lng from URL:", latLng, "=> fallback:", coordString);
      return Promise.resolve(coordString);
    }

    // APIキーがある場合は place_id の取得を試みる。
    // 取得に失敗（place_id が見つからない、または fetch エラー）した場合は例外を投げる。
    return getPlaceIdFromLatLng(latLng.lat, latLng.lng)
      .then((placeId) => {
        if (placeId) return placeId;
        // place_id が取得できなかった（APIが正常に応答したが結果が空）
        throw new Error("Google Maps API: place_id not found for given coordinates");
      })
      .catch((err) => {
        // ネットワークなどで API 呼び出しに失敗した場合も、呼び出し元で 500 を返せるよう例外として伝搬させる
        throw new Error(`Google Maps API error: ${err?.message || String(err)}`);
      });
  }
  // または /16s%2Fg%2F 形式の場合（google短縮ID）
  const matchAlt = url.match(/16s%2Fg%2F([a-zA-Z0-9_]+)/);
  if (matchAlt && matchAlt[1]) {
    return `/g/${matchAlt[1]}`;
  }
  return null; // 対応するパターンがなければ取得失敗
}
