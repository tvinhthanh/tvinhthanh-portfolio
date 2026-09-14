/**
 * A constellation unique to each project, derived from its repository name:
 * the same lattice as the world outside, sampled at one frozen moment. No two
 * alike, no stock art, and it costs a few hundred bytes.
 */

type Node = { x: number; y: number };
type Line = { x1: number; y1: number; x2: number; y2: number; opacity: number };

type PatternData = {
  nodes: Node[];
  lines: Line[];
  accentGlow: { cx: number; cy: number; r: number };
};

const cache = new Map<string, PatternData>();

function build(seed: string): PatternData {
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

  const nodeCount = 14;
  const nodes: Node[] = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.round(15 + next() * 230),
      y: Math.round(10 + next() * 60),
    });
  }

  const lines: Line[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 65) {
        lines.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
          opacity: Math.max(0.08, Math.round((1 - dist / 65) * 0.45 * 100) / 100),
        });
      }
    }
  }

  const data: PatternData = {
    nodes,
    lines,
    accentGlow: {
      cx: Math.round(50 + next() * 160),
      cy: Math.round(20 + next() * 40),
      r: Math.round(35 + next() * 25),
    },
  };

  cache.set(seed, data);
  return data;
}

export function Sigil({ seed, className = "" }: { seed: string; className?: string }) {
  const { nodes, lines, accentGlow } = build(seed);

  return (
    <svg
      viewBox="0 0 260 80"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Soft focal glow */}
        <radialGradient id={`sigil-glow-${seed}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background ambient auroral orb */}
      <circle
        cx={accentGlow.cx}
        cy={accentGlow.cy}
        r={accentGlow.r}
        fill={`url(#sigil-glow-${seed})`}
      />

      {/* Geometric constellation lattice lines */}
      <g stroke="currentColor" strokeWidth="0.75">
        {lines.map((l, i) => (
          <line
            key={`l-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            strokeOpacity={l.opacity}
          />
        ))}
      </g>

      {/* Star constellation nodes */}
      <g fill="currentColor">
        {nodes.map((n, i) => (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r="1.1" opacity="0.65" />
            <circle cx={n.x} cy={n.y} r="2.4" opacity="0.18" />
          </g>
        ))}
      </g>
    </svg>
  );
}
