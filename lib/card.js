// Draws one open home card in the McKean McGregor website style.
// Cards are drawn at twice the email size (1040 wide) so they stay sharp on phones; the email shows them at 520 wide.

const C = { black: '#000000', text: '#1A1A1A', text2: '#333333', yellow: '#f5a623', white: '#ffffff' };
export const CARD_WIDTH = 1040;
export const CARD_HEIGHT = 1240;
export const DAY_HEADING_HEIGHT = 190; // extra height on the first card of each day, for the day heading // tall enough for a two-line address; the white space at the bottom is the gap between cards

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
  return h('div', { display: 'flex', flexDirection: 'column', width: CARD_WIDTH, height: CARD_HEIGHT + (showDay ? DAY_HEADING_HEIGHT : 0), background: C.white }, blocks);
}
