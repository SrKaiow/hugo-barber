// Cloudflare Worker: serves the static site and /api/reviews (Google reviews).
// Set secrets in Cloudflare > Workers > hugo-barber > Settings > Variables:
//   GOOGLE_PLACES_KEY, GOOGLE_PLACE_ID
import { onRequestGet as reviews } from "./functions/api/reviews.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/reviews" && request.method === "GET") {
      return reviews({ env, request, waitUntil: (p) => ctx.waitUntil(p) });
    }
    return env.ASSETS.fetch(request);
  },
};
