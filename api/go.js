// Card link: /api/go?n=1 sends the reader to the 1st open home's listing page.
// Empty slots, or anything unexpected, go to the open homes page instead.
import { getOpenHomes, OPEN_HOMES_PAGE } from '../lib/openhomes.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const n = parseInt(new URL(req.url).searchParams.get('n') || '1', 10);
  let target = OPEN_HOMES_PAGE;
  try { const item = (await getOpenHomes())[n - 1]; if (item && item.url) target = item.url; } catch (_) {}
  return new Response(null, { status: 302, headers: { location: target, 'cache-control': 'no-store' } });
}
