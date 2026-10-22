// Card image: /api/card?n=1 draws the 1st open home (with its day heading if it is the first of that day) on the website's open homes page, n=2 the 2nd, and so on.
// When there is no open home for that slot it returns a transparent strip 1040 wide and 1 pixel high.
// The email shows it at 520 wide, so it is half a pixel high and the empty slot collapses to nothing.
import { ImageResponse } from '@vercel/og';
import { getOpenHomes } from '../lib/openhomes.js';
import { cardElement, cardHeight, CARD_WIDTH } from '../lib/card.js';
import { cardFonts, photoDataUrl } from '../lib/assets.js';
 
export const config = { runtime: 'edge' };
 
const BLANK = 'iVBORw0KGgoAAAANSUhEUgAABBAAAAABCAYAAABnoF3dAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAG0lEQVR42u3BgQAAAADDoPlTH+ECVQEAAAAcAxBBAAFEa7aUAAAAAElFTkSuQmCC';
const CACHE = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';
 
function blank() {
  const bin = atob(BLANK);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Response(bytes, { headers: { 'content-type': 'image/png', 'cache-control': CACHE } });
}
 
export default async function handler(req) {
  const n = parseInt(new URL(req.url).searchParams.get('n') || '1', 10);
  let item = null, showDay = false;
  try {
    const items = await getOpenHomes();
    item = items[n - 1] || null;
    // The first open home of each day carries the day heading, so the email is grouped by day like the page
    if (item) showDay = n === 1 || (items[n - 2] && items[n - 2].day !== item.day);
  } catch (_) { item = null; }
  if (!item) return blank();
  const [fonts, photo] = await Promise.all([cardFonts(), photoDataUrl(item.img)]);
  return new ImageResponse(cardElement(item, photo, showDay), {
    width: CARD_WIDTH, height: cardHeight(item, showDay), fonts,
    headers: { 'cache-control': CACHE },
  });
}
