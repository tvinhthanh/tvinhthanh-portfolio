/**
 * Warm hues to gold.
 *
 * The docent model ships with an orange chest light and orange soles painted
 * into its texture. Orange is fire, and fire melts metal, so every warm,
 * saturated pixel is moved to the site's gold at its original lightness: the
 * shading painted into it survives, only the hue and its intensity change.
 * Greys (the body) and the cyan eyes (water, which metal feeds) are left alone.
 */
const GOLD_HUE = 42; // --accent, #edd49a
const GOLD_MAX_SATURATION = 0.68;
const WARM_FROM = 330; // magenta-red ...
const WARM_TO = 50; // ... through orange to amber

function hueToChannel(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/** Rewrites RGBA pixel data in place. Returns how many pixels it moved. */
export function warmToGold(data: Uint8ClampedArray) {
  const h = GOLD_HUE / 360;
  let moved = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    if (delta < 0.12) continue;

    const l = (max + min) / 2;
    const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (s < 0.35) continue;

    let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
    if (hue > WARM_TO && hue < WARM_FROM) continue;

    const sat = Math.min(s, GOLD_MAX_SATURATION);
    const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
    const p = 2 * l - q;
    data[i] = Math.round(hueToChannel(p, q, h + 1 / 3) * 255);
    data[i + 1] = Math.round(hueToChannel(p, q, h) * 255);
    data[i + 2] = Math.round(hueToChannel(p, q, h - 1 / 3) * 255);
    moved++;
  }

  return moved;
}
