import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uDpr;
  attribute float aSeed;
  varying float vH;
  varying float vFog;
  varying float vSeed;

  // Ridged sum-of-sines. Cheap, and shaped so peaks stay sharp while valleys
  // flatten out — which is what reads as a mountain range rather than a wave.
  float ridged(vec2 p) {
    float n = 0.0;
    n += sin(p.x * 0.055 + 0.7) * 1.0;
    n += sin(p.x * 0.130 - p.y * 0.050) * 0.55;
    n += sin(p.y * 0.041 + 1.9) * 0.90;
    n += sin((p.x + p.y) * 0.021) * 1.20;
    n += sin(p.x * 0.310 + p.y * 0.110) * 0.16;
    return n;
  }

  void main() {
    vec3 p = position;

    // Map the full signed range into 0..1 first. Clamping at zero instead
    // leaves half the field dead flat, which reads as sparse noise rather
    // than a landscape.
    float k = clamp(ridged(p.xz) / 3.6 * 0.5 + 0.5, 0.0, 1.0);
    float h = pow(k, 2.1);

    p.y = h * uAmp;
    // Whole ranges rise and settle over ~70 seconds: floating, not bobbing.
    p.y += sin(uTime * 0.09 + p.x * 0.010) * 0.7;

    float depth = -p.z;
    vFog = 1.0 - smoothstep(42.0, 150.0, depth);
    vH = h;
    vSeed = aSeed;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.15 + vH * 1.9) * (98.0 / max(-mv.z, 1.0)) * uDpr;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uFar;
  uniform vec3 uNear;
  uniform vec3 uPearl;
  uniform float uAlpha;
  varying float vH;
  varying float vFog;
  varying float vSeed;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float dd = dot(c, c);
    if (dd > 0.25) discard;

    float soft = smoothstep(0.25, 0.02, dd);
    vec3 col = mix(uNear, uFar, vH);

    // One ridge point in thirty catches the light — pearl on the highest
    // peaks, and the only place a second colour appears in the scene.
    col = mix(col, uPearl, step(0.966, vSeed) * smoothstep(0.70, 1.0, vH));

    gl_FragColor = vec4(col, soft * vFog * uAlpha * (0.16 + vH * 0.62));
  }
`;

export type TerrainUniforms = {
  uTime: { value: number };
  uAmp: { value: number };
  uDpr: { value: number };
  uFar: { value: THREE.Color };
  uNear: { value: THREE.Color };
  uPearl: { value: THREE.Color };
  uAlpha: { value: number };
};

/** The distant range: a point-cloud landscape that fades into mist. */
export function createTerrain(cols: number, rows: number, dpr: number) {
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  let i = 0;
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < rows; z++) {
      positions[i * 3] = (x / (cols - 1) - 0.5) * 155;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = -6 - (z / (rows - 1)) * 155;
      seeds[i] = Math.random();
      i++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const uniforms: TerrainUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0 },
    uDpr: { value: dpr },
    uFar: { value: new THREE.Color("#cdd8dc") },
    uNear: { value: new THREE.Color("#26333a") },
    uPearl: { value: new THREE.Color("#fbf6e8") },
    uAlpha: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  // Height is shader-displaced, so the derived bounds are wrong here too.
  points.frustumCulled = false;

  return { points, geometry, material, uniforms };
}
