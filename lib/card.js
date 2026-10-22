// Draws one open home card in the McKean McGregor website style.
// Cards are drawn at twice the email size (1040 wide) so they stay sharp on phones; the email shows them at 520 wide.
 
const C = { black: '#000000', text: '#1A1A1A', text2: '#333333', yellow: '#f5a623', white: '#ffffff' };
export const CARD_WIDTH = 1040;
export const DAY_HEADING_HEIGHT = 190; // extra height on the first card of each day, for the day heading
const GAP_BELOW = 96; // white space under the button: the gap before the next card (48px in the email)
 
// Rough width of text in Montserrat, erring on the wide side, so long lines are counted as wrapping rather than missed
function textLines(text, fontSize, width) {
  let w = 0;
  for (const ch of String(text || '')) {
    if (ch === ' ') w += 0.3;
    else if (/[A-Z]/.test(ch)) w += 0.74;
    else if (/[0-9$]/.test(ch)) w += 0.64;
    else if (/[a-z]/.test(ch)) w += 0.58;
    else w += 0.36;
  }
  return Math.max(1, Math.ceil((w * fontSize) / (width * 0.92)));
}
 
// The card's height is worked out from what is on it, so nothing is ever cut off,
// however long the address or price is. Each line height below is the layout's own size.
export function cardHeight(item, showDay) {
  let hgt = 780 + 36;                                               // photo, space above the text
  hgt += textLines(item.when, 30, CARD_WIDTH) * 34;                 // OPEN day and time
  if (item.price) hgt += 24 + textLines(item.price, 34, CARD_WIDTH) * 44;
  hgt += 14 + textLines(item.address, 44, CARD_WIDTH) * 58;          // street address
  if (item.specs && item.specs.length) hgt += 18 + textLines(item.specs.join('    '), 30, CARD_WIDTH) * 42;
  if (item.host) hgt += 12 + 40;                                    // Hosted by
  hgt += 36 + 92;                                                   // View property button
  hgt += GAP_BELOW;
  if (showDay) hgt += DAY_HEADING_HEIGHT;
  return Math.ceil(hgt);
}
 
// Small helper so the layout can be written without a build step
const h = (type, style, children) => ({ type, props: { style, children } });
 
export function cardElement(item, photoDataUrl, showDay) {
  const blocks = [];
  if (showDay) {
    // Day heading, as on the open homes page, e.g. "Saturday, 24th October", with a short yellow line under it
    blocks.push(h('div', { display: 'flex', flexDirection: 'column', height: DAY_HEADING_HEIGHT, justifyContent: 'flex-end', paddingBottom: 56 }, [
      h('div', { display: 'flex', fontFamily: 'Montserrat', fontWeight: 300, fontSize: 52, color: C.text }, item.day),
      h('div', { display: 'flex', width: 96, height: 6, background: C.yellow, marginTop: 22 }, []),
    ]));
  }
  if (photoDataUrl) {
    blocks.push({ type: 'img', props: { src: photoDataUrl, width: CARD_WIDTH, height: 780, style: { width: CARD_WIDTH, height: 780, objectFit: 'cover' } } });
  } else {
    blocks.push(h('div', { width: CARD_WIDTH, height: 780, background: '#F3F2F2', display: 'flex' }, []));
  }
  const text = [];
  text.push(h('div', { display: 'flex', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 26, letterSpacing: 2, color: C.text }, [
    h('span', { color: C.yellow, marginRight: 18 }, 'OPEN'),
    h('span', {}, item.when),
  ]));
  if (item.price) text.push(h('div', { display: 'flex', marginTop: 24, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 34, color: C.black }, item.price));
  text.push(h('div', { display: 'flex', marginTop: 14, fontFamily: 'Montserrat', fontWeight: 400, fontSize: 44, lineHeight: 1.3, color: C.text }, item.address));
  if (item.specs && item.specs.length) {
    text.push(h('div', { display: 'flex', flexWrap: 'wrap', marginTop: 18, fontFamily: 'Open Sans', fontSize: 30, color: C.text2 },
      item.specs.map((s) => h('span', { marginRight: 34 }, s))));
  }
  if (item.host) {
    text.push(h('div', { display: 'flex', marginTop: 12, fontFamily: 'Open Sans', fontSize: 28, color: C.text2 }, [
      h('span', { marginRight: 10 }, 'Hosted by'),
      h('span', { color: C.text, textDecoration: 'underline' }, item.host),
    ]));
  }
  text.push(h('div', { display: 'flex', marginTop: 36 }, [
    h('div', { display: 'flex', background: C.black, color: C.white, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 30, padding: '28px 80px' }, 'View property'),
  ]));
  blocks.push(h('div', { display: 'flex', flexDirection: 'column', paddingTop: 36 }, text));
  return h('div', { display: 'flex', flexDirection: 'column', width: CARD_WIDTH, height: cardHeight(item, showDay), background: C.white }, blocks);
}
