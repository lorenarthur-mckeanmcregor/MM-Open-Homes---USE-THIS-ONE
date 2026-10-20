// Fonts (the website's Montserrat and Open Sans, from Google Fonts) and photos for the cards.

const fontCache = {};

async function googleFont(family, weight) {
  const key = family + weight;
  if (fontCache[key]) return fontCache[key];
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}`)).text();
  const url = (css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/) || [])[1];
  if (!url) throw new Error('Font not found: ' + family + ' ' + weight);
  fontCache[key] = await (await fetch(url)).arrayBuffer();
  return fontCache[key];
}

export async function cardFonts() {
  const [m400, m600, o400] = await Promise.all([
    googleFont('Montserrat', 400), googleFont('Montserrat', 600), googleFont('Open Sans', 400),
  ]);
  return [
    { name: 'Montserrat', data: m400, weight: 400, style: 'normal' },
    { name: 'Montserrat', data: m600, weight: 600, style: 'normal' },
    { name: 'Open Sans', data: o400, weight: 400, style: 'normal' },
  ];
}

function toDataUrl(buf, type) {
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return `data:${type};base64,${btoa(bin)}`;
}

// Rex keeps an 800x600 copy of every listing photo; use it (smaller, faster), and fall back to the original.
export async function photoDataUrl(src) {
  if (!src) return null;
  const tries = [src.replace(/\.jpg$/i, '_800x600.jpg'), src];
  for (const u of tries) {
    try {
      const r = await fetch(u);
      if (r.ok && (r.headers.get('content-type') || '').startsWith('image/')) return toDataUrl(await r.arrayBuffer(), r.headers.get('content-type'));
    } catch (_) {}
  }
  return null;
}
