/**
 * A constellation unique to each project, derived from its repository name:
 * the same lattice as the world outside, sampled at one frozen moment. No two
 * alike, no stock art, and it costs a few hundred bytes.
 */

type Dot = { key: string; cx: number; cy: number; r: number; o: number };

/* Values are rounded because React serialises floats differently on the server
   and in the browser, and the last digit is enough to break hydration. */
const round = (n: number) => Math.round(n * 1000) / 1000;

const COLS = 52;
const ROWS = 16;

/* Generation lives outside the component: it is a pure function of the seed,
   and the result is cached so six cards do not recompute on every render. */
const cache = new Map<string, Dot[]>();

function build(seed: string): Dot[] {
  const cached = cache.get(seed);
  if (cached) return cached;

  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
  }
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1000) / 1000;
  };

  const phase = round(next() * 6.28);
  const freq = round(0.28 + next() * 0.42);
  const skew = round(0.16 + next() * 0.3);

  const dots: Dot[] = [];
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const strength = Math.abs(
        Math.sin(x * freq + phase) * Math.cos(y * skew + phase * 0.5),
      );
      dots.push({
        key: `${x}-${y}`,
        cx: x * 5 + 3,
        cy: y * 5 + 3,
        r: round(0.28 + strength * 0.95),
        o: round(0.1 + strength * 0.55),
      });
    }
  }

  cache.set(seed, dots);
  return dots;
}

export function Sigil({ seed, className = "" }: { seed: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 260 80"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="currentColor">
        {build(seed).map((dot) => (
          <circle key={dot.key} cx={dot.cx} cy={dot.cy} r={dot.r} opacity={dot.o} />
        ))}
      </g>
    </svg>
  );
}
