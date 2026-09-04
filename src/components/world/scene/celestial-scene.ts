import * as THREE from "three";
import type { Tier } from "@/hooks/use-device-capability";
import { createQiRiver } from "./qi-river";
import { createTerrain } from "./terrain";

const BUDGET: Record<Tier, { cols: number; rows: number; qi: number; dpr: number }> = {
  full: { cols: 250, rows: 150, qi: 15000, dpr: 1.75 },
  reduced: { cols: 150, rows: 90, qi: 5200, dpr: 1.25 },
  minimal: { cols: 130, rows: 80, qi: 2200, dpr: 1.25 },
};

const readVar = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The world. One fixed canvas behind the whole document: a distant range, a
 * river of qi running through it, and a camera that drifts deeper as you read.
 *
 * Everything here is imperative on purpose — scroll, pointer and time drive
 * uniforms directly, so React never re-renders while the scene is running.
 */
export function createCelestialScene(host: HTMLElement, tier: Tier) {
  const budget = BUDGET[tier];
  const still = tier === "minimal";

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: tier === "full" ? "high-performance" : "low-power",
    });
    if (!renderer.getContext()) throw new Error("no webgl context");
  } catch {
    host.dataset.ready = "true";
    return { dispose() {} };
  }

  const dpr = Math.min(window.devicePixelRatio || 1, budget.dpr);
  renderer.setPixelRatio(dpr);
  renderer.setClearAlpha(0);
  host.appendChild(renderer.domElement);
  host.dataset.gl = "on";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.5, 260);

  const terrain = createTerrain(budget.cols, budget.rows, dpr);
  const qi = createQiRiver(budget.qi, dpr);

  const world = new THREE.Group();
  world.add(terrain.points);
  world.add(qi.points);
  scene.add(world);

  /* ---------------- theme ---------------- */

  const syncTheme = () => {
    terrain.uniforms.uFar.value.set(readVar("--world-far", "#cdd8dc"));
    terrain.uniforms.uNear.value.set(readVar("--world-near", "#26333a"));
    terrain.uniforms.uPearl.value.set(readVar("--world-pearl", "#fbf6e8"));
    qi.uniforms.uQi.value.set(readVar("--world-qi", "#e3cb93"));
    qi.uniforms.uPearl.value.set(readVar("--world-pearl", "#fbf6e8"));

    const alpha = Number(readVar("--world-alpha", "1")) || 1;
    terrain.uniforms.uAlpha.value = alpha;
    qi.uniforms.uAlpha.value = alpha * 0.92;

    // On paper the river is ink, not light: additive would only wash it out.
    qi.material.blending =
      readVar("--world-blend", "normal") === "screen"
        ? THREE.AdditiveBlending
        : THREE.NormalBlending;
    qi.material.needsUpdate = true;
    if (still) renderOnce();
  };

  /* ---------------- layout ---------------- */

  // On a phone the scene occupies the whole screen at once, so it has to give
  // the content far more room than it does on a desktop canvas.
  let damp = 1;

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Narrow screens see a narrower river, or it runs off both sides
    qi.uniforms.uWidth.value = w < 768 ? 0.55 : 1;
    damp = w < 768 ? 0.45 : w < 1100 ? 0.85 : 1;
  };

  /* ---------------- scroll & pointer ---------------- */

  const target = { scroll: 0, px: 0, py: 0 };
  const eased = { scroll: 0, px: 0, py: 0 };

  /* A card in the document can ask the world to acknowledge it: the river
     brightens and quickens for about a second, then settles. Fired from the
     DOM as a plain event so no component ever holds a handle to the scene. */
  let pulse = 0;
  const onPulse = () => {
    pulse = 1;
  };

  const readScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    target.scroll = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
  };

  const onPointerMove = (event: PointerEvent) => {
    target.px = (event.clientX / window.innerWidth) * 2 - 1;
    target.py = (event.clientY / window.innerHeight) * 2 - 1;
  };

  let lastRecede = -1;

  /** Everything the scroll position controls, in one place. */
  function applyProgress(p: number) {
    camera.position.set(
      eased.px * 1.8,
      lerp(13, 15.5, p) + eased.py * 1.1,
      lerp(30, -8, p),
    );
    // The camera travels forward but barely pitches: tilting down through the
    // scroll pushed the river into the bottom of the frame, where the veil is
    // opaque, and the flow appeared to stop partway down the page.
    camera.lookAt(eased.px * 2.6, lerp(8.5, 7.2, p), -80);

    terrain.uniforms.uAmp.value = lerp(17, 10, p);

    // The range is what sits behind paragraphs, so the range is what recedes.
    // The river is the signature and runs the whole length of the document —
    // it only steps back far enough to stay out of the way of the text.
    const base = (Number(readVar("--world-alpha", "1")) || 1) * damp;
    terrain.uniforms.uAlpha.value = base * lerp(1, 0.3, p);
    qi.uniforms.uSpeed.value = lerp(1, 1.9, p) + pulse * 1.2;
    qi.uniforms.uAlpha.value = base * lerp(1, 0.72, p) * (1 + pulse * 0.55);

    // Written to the DOM only when it actually moves: a style write every
    // frame would force a recalc on every frame for no visible gain.
    const recede = Math.round(p * 50) / 50;
    if (recede !== lastRecede) {
      lastRecede = recede;
      document.documentElement.style.setProperty("--world-recede", String(recede));
    }
  }

  /* ---------------- loop ---------------- */

  const start = performance.now();
  let raf = 0;
  let running = false;
  let visible = true;

  function renderOnce() {
    // A composed still: the world at a moment worth stopping on.
    terrain.uniforms.uTime.value = 6.5;
    qi.uniforms.uTime.value = 6.5;
    eased.scroll = target.scroll;
    applyProgress(eased.scroll);
    renderer.render(scene, camera);
  }

  const frame = (now: number) => {
    const elapsed = (now - start) / 1000;
    terrain.uniforms.uTime.value = elapsed;
    qi.uniforms.uTime.value = elapsed;

    pulse *= 0.955;
    if (pulse < 0.002) pulse = 0;

    // Ease towards the targets so the camera never snaps with the scrollbar
    eased.scroll += (target.scroll - eased.scroll) * 0.055;
    eased.px += (target.px - eased.px) * 0.03;
    eased.py += (target.py - eased.py) * 0.03;

    applyProgress(eased.scroll);
    world.rotation.y = Math.sin(elapsed * 0.03) * 0.02 + eased.px * 0.03;

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  };

  const setRunning = (shouldRun: boolean) => {
    if (shouldRun === running) return;
    running = shouldRun;
    if (running) raf = requestAnimationFrame(frame);
    else cancelAnimationFrame(raf);
  };

  const evaluate = () => setRunning(!still && visible && !document.hidden);

  /* ---------------- wiring ---------------- */

  resize();
  syncTheme();
  readScroll();

  const onScroll = () => {
    readScroll();
    if (still) renderOnce();
  };

  if (still) {
    renderOnce();
  } else {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    setRunning(true);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("world:pulse", onPulse);
  document.addEventListener("visibilitychange", evaluate);

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      evaluate();
    },
    { threshold: 0 },
  );
  io.observe(host);

  const ro = new ResizeObserver(() => {
    resize();
    if (still) renderOnce();
  });
  ro.observe(host);

  const themeWatcher = new MutationObserver(syncTheme);
  themeWatcher.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", syncTheme);

  host.dataset.ready = "true";

  return {
    dispose() {
      setRunning(false);
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeWatcher.disconnect();
      media.removeEventListener("change", syncTheme);
      document.removeEventListener("visibilitychange", evaluate);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("world:pulse", onPulse);
      window.removeEventListener("pointermove", onPointerMove);
      terrain.geometry.dispose();
      terrain.material.dispose();
      qi.geometry.dispose();
      qi.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete host.dataset.gl;
      document.documentElement.style.removeProperty("--world-recede");
    },
  };
}
