// Check page: /api/list shows what the service currently reads from the open homes page, as plain text.
import { getOpenHomes } from '../lib/openhomes.js';

export const config = { runtime: 'edge' };

export default async function handler() {
  let body;
  try {
    const items = await getOpenHomes();
    body = items.length
      ? items.map((x, i) => `${i + 1}. ${x.when} | ${x.address} | ${x.price} | ${x.host || 'no host'}`).join('\n')
      : 'No open homes found on the open homes page.';
  } catch (err) { body = 'Could not read the open homes page: ' + err.message; }
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
}
