// Reads the live open homes page on the McKean McGregor website and returns the open homes in page order.
// No Rex API key is used: this is the same public page anyone can see.

export const SITE = 'https://mckeanmcgregor.com.au';
export const OPEN_HOMES_PAGE = SITE + '/openhomes?type=sale';
const CACHE_MS = 5 * 60 * 1000; // keep a copy for 5 minutes so the website isn't hit on every email open

let cache = { at: 0, items: null };

const decode = (s) => String(s || '')
  .replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const strip = (s) => decode(String(s || '').replace(/<[^>]*>/g, ' '));
const abs = (u) => !u ? '' : u.startsWith('//') ? 'https:' + u : u.startsWith('/') ? SITE + u : u;

// The website draws each spec with its own icon; these are the start of each icon's drawing
const ICONS = [['d="M0 4.38462', 'Bed'], ['d="M5.33334 6', 'Bath'], ['d="M1 10.0356', 'Car']];

function landText(t) {
  const m = String(t).match(/^([\d.,]+)\s*(m²|m2|ha|ac)/i);
  if (!m) return t;
  const n = parseFloat(m[1].replace(/,/g, ''));
  const u = m[2].toLowerCase();
  if (u === 'm²' || u === 'm2') return Math.round(n).toLocaleString('en-AU') + ' m²';
  return String(Math.round(n * 100) / 100) + ' ' + u;
}

function whenText(day, time) {
  const m = day.match(/^(\w+),\s*(\d+)\w*\s+(\w+)/);
  const d = m ? (m[1].slice(0, 3) + ' ' + m[2] + ' ' + m[3].slice(0, 3)).toUpperCase() : day.toUpperCase();
  return d + ', ' + time.replace(/\s*-\s*/, ' to ');
}

export function parseOpenHomes(html) {
  const items = [];
  const blocks = html.split('data-testid="event-block"').slice(1);
  for (const block of blocks) {
    const dayM = block.match(/role="text-open-home-day-title"[^>]*>([^<]+)</);
    const day = dayM ? decode(dayM[1]) : '';
    const rows = block.split('data-testid="event-listing-image"').slice(1);
    for (const row of rows) {
      const href = (row.match(/^[^>]*href="([^"]+)"/) || [])[1] || '';
      const img = (row.match(/\ssrc=['"](\/\/au-crm[^'"]+|https:\/\/au-crm[^'"]+)['"]/) || [])[1] || '';
      const addrM = row.match(/data-testid="event-address"[^>]*>\s*<h4[^>]*>([\s\S]*?)<\/h4>/);
      const full = addrM ? strip(addrM[1]) : '';
      const am = full.match(/^(.*),\s*(.+?)\s+(VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\s+(\d{4})$/);
      const info = {};
      for (const m of row.matchAll(/data-testid="event-text-heading"[^>]*>([^<]*)<\/p>\s*<p[^>]*data-testid="event-text-content"[^>]*>([^<]*)<\/p>/g)) {
        info[decode(m[1])] = decode(m[2]);
      }
      const specs = [];
      for (const [d, label] of ICONS) {
        const i = row.indexOf(d);
        if (i > -1) {
          const v = row.slice(i).match(/<p[^>]*>([^<]+)<\/p>/);
          if (v) specs.push(decode(v[1]) + ' ' + label);
        }
      }
      const landM = row.match(/title="Land Area"[\s\S]*?<p[^>]*>([^<]+)<\/p>/);
      if (landM) specs.push(landText(decode(landM[1])));
      let host = '', hostUrl = '';
      const agentChunk = row.split('data-testid="event-agent"')[1] || '';
      for (const m of agentChunk.matchAll(/<a[^>]*href="(\/staff\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
        const name = strip(m[2]);
        if (name) { host = name; hostUrl = abs(m[1]); break; }
      }
      const type = Object.keys(info).find((k) => k !== 'Open Home') || '';
      if (!href || !full) continue;
      items.push({
        url: abs(href), img: abs(img), day,
        when: whenText(day, info['Open Home'] || ''),
        price: info[type] || '',
        address: am ? `${am[1]}, ${am[2].toUpperCase()} ${am[3]} ${am[4]}` : full,
        specs, host, hostUrl,
      });
    }
  }
  return items;
}

export async function getOpenHomes() {
  if (cache.items && Date.now() - cache.at < CACHE_MS) return cache.items;
  const res = await fetch(OPEN_HOMES_PAGE, { headers: { 'user-agent': 'McKeanMcGregor-EmailCards/1.0' } });
  if (!res.ok) { if (cache.items) return cache.items; throw new Error('Open homes page returned ' + res.status); }
  const items = parseOpenHomes(await res.text());
  cache = { at: Date.now(), items };
  return items;
}
