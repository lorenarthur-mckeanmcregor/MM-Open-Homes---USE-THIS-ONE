// Card link: /api/go?n=1 sends the reader to the 1st open home's listing page.
// Empty slots, or anything unexpected, go to the open homes page instead.
// Every link carries tracking tags so GA4 counts the visit under the Email channel
// (utm_medium=email) and shows which card was clicked (utm_content=card-1 to card-20).
import { getOpenHomes, OPEN_HOMES_PAGE } from '../lib/openhomes.js';

export const config = { runtime: 'edge' };

const TAGS = { utm_source: 'rex', utm_medium: 'email', utm_campaign: 'open-homes-weekly' };

function tagged(target, content) {
  try {
    const u = new URL(target);
    for (const [k, v] of Object.entries(TAGS)) u.searchParams.set(k, v);
    u.searchParams.set('utm_content', content);
    return u.toString();
  } catch (_) {
    return target;
  }
}

export default async function handler(req) {
  const n = parseInt(new URL(req.url).searchParams.get('n') || '1', 10);
  let target = OPEN_HOMES_PAGE;
  let content = 'card-' + n + '-empty';
  try {
    const item = (await getOpenHomes())[n - 1];
    if (item && item.url) { target = item.url; content = 'card-' + n; }
  } catch (_) {}
  return new Response(null, { status: 302, headers: { location: tagged(target, content), 'cache-control': 'no-store' } });
}
