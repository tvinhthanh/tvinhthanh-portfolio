import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uWidth;
  uniform float uDpr;
  attribute float aT;
  attribute float aSeed;
  attribute vec3 aOffset;
  varying float vLife;
  varying float vSeed;

  void main() {
    float t = fract(aT + uTime * 0.03 * uSpeed);

    vec3 p;

    // A current flowing ACROSS the middle distance, not away from the viewer.
    // Running it into depth was the mistake: perspective put most of the
    // particles within a few units of the camera and shrank the rest to
    // nothing, so it read as one clump that slid out of frame on scroll.
    // Here t drives lateral position, so the stream always crosses the width.
    p.x = (t - 0.5) * 200.0 * uWidth + aOffset.x;

    // Depth and height only meander, keeping the perspective scale even.
    p.z = -34.0 - sin(t * 3.1 + 0.6) * 26.0 + aOffset.z;
    p.y = 6.0 + sin(t * 4.2 + 1.1) * 4.0 + aOffset.y;

    p.x += sin(uTime * 0.45 + aSeed * 12.0) * 0.7;
    p.y += cos(uTime * 0.38 + aSeed * 9.0) * 0.5;

    // Dissolve at both ends so nothing pops in at the edge of the frame.
    vLife = smoothstep(0.0, 0.09, t) * (1.0 - smoothstep(0.91, 1.0, t));
    vSeed = aSeed;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.4 + aSeed * 2.1) * min(96.0 / max(-mv.z, 1.0), 7.0) * uDpr;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uQi;
  uniform vec3 uPearl;
  uniform float uAlpha;
  varying float vLife;
  varying float vSeed;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float dd = dot(c, c);
    if (dd > 0.25) discard;

    float soft = smoothstep(0.25, 0.0, dd);
    vec3 col = mix(uQi, uPearl, step(0.94, vSeed) * 0.75);
    gl_FragColor = vec4(col, soft * vLife * uAlpha);
  }
`;

export type QiUniforms = {
  uTime: { value: number };
  uSpeed: { value: number };
  uWidth: { value: number };
  uDpr: { value: number };
  uQi: { value: THREE.Color };
  uPearl: { value: THREE.Color };
  uAlpha: { value: number };
};

/** The river of qi: a stream of particles running away through the range. */
export function createQiRiver(count: number, dpr: number) {
  const positions = new Float32Array(count * 3);
  const progress = new Float32Array(count);
  const offsets = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Stratified rather than uniform-random: an even spread along the path is
    // what makes the stream look continuous instead of patchy.
    progress[i] = (i + Math.random() * 0.85) / count;
    seeds[i] = Math.random();

    // A loose braid rather than a single thread.
    offsets[i * 3] = (Math.random() - 0.5) * 12;
    offsets[i * 3 + 1] = (Math.random() - 0.5) * 4.2;
    offsets[i * 3 + 2] = (Math.random() - 0.5) * 16;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aT", new THREE.BufferAttribute(progress, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 3));

  const uniforms: QiUniforms = {
    uTime: { value: 0 },
    uSpeed: { value: 1 },
    uWidth: { value: 1 },
    uDpr: { value: dpr },
    uQi: { value: new THREE.Color("#e3cb93") },
    uPearl: { value: new THREE.Color("#fbf6e8") },
    uAlpha: { value: 0.9 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  // Every particle position is computed in the vertex shader, so the position
  // attribute is all zeros and three.js derives a bounding sphere of radius 0
  // at the origin. Once the camera moved past that point the whole stream was
  // frustum-culled and vanished mid-page. There is nothing to cull against.
  points.frustumCulled = false;

  return { points, geometry, material, uniforms };
}
