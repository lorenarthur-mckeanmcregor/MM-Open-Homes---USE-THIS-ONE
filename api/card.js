// Card image: /api/card?n=1 draws the 1st open home on the website's open homes page, n=2 the 2nd, and so on.
// When there is no open home for that slot it returns a 1 pixel transparent image, so the email shows nothing there.
import { ImageResponse } from '@vercel/og';
import { getOpenHomes } from '../lib/openhomes.js';
import { cardElement, CARD_WIDTH, CARD_HEIGHT } from '../lib/card.js';
import { cardFonts, photoDataUrl } from '../lib/assets.js';

export const config = { runtime: 'edge' };

const BLANK = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADUlEQVR4nGNgYGBgAAAABQABpfZFQAAAAABJRU5ErkJggg==';
const CACHE = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

function blank() {
  const bin = atob(BLANK);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Response(bytes, { headers: { 'content-type': 'image/png', 'cache-control': CACHE } });
}

export default async function handler(req) {
  const n = parseInt(new URL(req.url).searchParams.get('n') || '1', 10);
  let item = null;
  try { item = (await getOpenHomes())[n - 1] || null; } catch (_) { item = null; }
  if (!item) return blank();
  const [fonts, photo] = await Promise.all([cardFonts(), photoDataUrl(item.img)]);
  return new ImageResponse(cardElement(item, photo), {
    width: CARD_WIDTH, height: CARD_HEIGHT, fonts,
    headers: { 'cache-control': CACHE },
  });
}
