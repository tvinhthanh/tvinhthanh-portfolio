/**
 * The workshop's metals. WebGL materials cannot read CSS custom properties, so
 * the dark-theme tokens from globals.css are mirrored here for the models.
 *
 * Same rule as the rest of the site: silver and pearl for the body, gold as
 * the one accent. No red or orange (fire melts metal), no green (metal cuts
 * wood). Where a model needs an escalating signal — a redline, a shift light,
 * a hotter drive mode — it climbs in brightness from silver through gold to
 * pearl instead of changing hue.
 */
export const metal = {
  /** --accent (dark) */
  gold: "#edd49a",
  /** --accent-hot (dark): the top of the ramp, the "redline". */
  goldHot: "#fdf0cb",
  goldDeep: "#d4a755",
  goldShadow: "#c99a3e",
  /** --world-pearl */
  pearl: "#fbf6e8",
  /** --metal (dark) */
  silver: "#b6c0c4",
  silverDeep: "#8395a1",
  titanium: "#5c6670",
  graphite: "#4a5358",
  carbon: "#111417",
  carbonDeep: "#090d0f",
  /** A lamp that is off. */
  unlit: "#22272b",
  glass: "#0d171b",
  /** --paper (dark), for shadows cast on the bench. */
  obsidian: "#0d1417",
} as const;

/** Drive modes escalate by brightness, not by colour. `sport` is the default
 *  and keeps the exact gold the models had before the repaint. */
export const modeTone = {
  sport: { glow: metal.gold, accent: metal.goldDeep, intensity: 0.8 },
  track: { glow: metal.goldHot, accent: metal.gold, intensity: 1.1 },
  corsa: { glow: metal.pearl, accent: metal.goldHot, intensity: 1.4 },
} as const;
