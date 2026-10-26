// Cloudflare Pages Function: GET /api/reviews
// Reads Hugo's Google reviews from the Places API (New) and caches them for 6 hours.
// Set in Cloudflare Pages > Settings > Environment variables:
//   GOOGLE_PLACES_KEY = your Google Maps Platform API key (Places API (New) enabled)
//   GOOGLE_PLACE_ID   = Hugo's Place ID (from his Google Business Profile)
export async function onRequestGet({ env, request, waitUntil }) {
  const json = (data, status = 200, maxAge = 0) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": `public, max-age=${maxAge}` },
    });

  if (!env.GOOGLE_PLACES_KEY || !env.GOOGLE_PLACE_ID) return json({ reviews: [] }, 200, 300);

  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/reviews?v=1", request.url).toString());
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const lang = (request.headers.get("accept-language") || "en").slice(0, 2);
  const r = await fetch(`https://places.googleapis.com/v1/places/${env.GOOGLE_PLACE_ID}?languageCode=${lang}`, {
    headers: {
      "X-Goog-Api-Key": env.GOOGLE_PLACES_KEY,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!r.ok) return json({ reviews: [], error: r.status }, 200, 300);
  const p = await r.json();

  const out = json({
    rating: p.rating ?? null,
    count: p.userRatingCount ?? 0,
    mapsUri: p.googleMapsUri ?? null,
    reviews: (p.reviews || []).map((rv) => ({
      author: rv.authorAttribution?.displayName || "Google user",
      photo: rv.authorAttribution?.photoUri || null,
      rating: rv.rating || 0,
      when: rv.relativePublishTimeDescription || "",
      text: rv.text?.text || rv.originalText?.text || "",
    })),
  }, 200, 21600);

  waitUntil(cache.put(cacheKey, out.clone()));
  return out;
}
