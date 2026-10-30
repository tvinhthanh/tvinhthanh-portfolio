// Loaded on demand (dynamic import) so three.js + GSAP stay out of the initial critical path.
//
// The canvas covers the viewport. The robot is placed in world space from the
// on-screen box of the current [data-robot-anchor] element, so it lines up with
// the layout at any viewport size. Between two anchors it "falls" to the next one.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { warmToGold } from "./retint";

gsap.registerPlugin(ScrollTrigger);

const MODEL_URL = "/models/friendly-robot.glb";
const TRAVEL_CLIP = "Free_Fall";
const CAMERA_DISTANCE = 10;
const CAMERA_FOV = 30;

export interface AnchorConfig {
  clip: string;
  turn: number;
  fit: number;
}

// The docent stands at the entrance and does not follow you into the rooms,
// so the lobby's threshold is its only post.
export const ANCHORS: Record<string, AnchorConfig> = {
  hero: { clip: "Look_Wave", turn: -0.38, fit: 1.0 },
};

/** Moves the texture's warm paint to gold, once, before it reaches the GPU. */
function retintTexture(texture: THREE.Texture) {
  const image = texture.image as (CanvasImageSource & { width: number; height: number }) | undefined;
  if (!image?.width || !image.height) return;

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  warmToGold(pixels.data);
  context.putImageData(pixels, 0, 0);

  if ("close" in image && typeof image.close === "function") image.close();
  // Same pixels in the same order: the loader never flips its bitmaps, and the
  // texture keeps flipY = false, so the UVs still land where they did.
  texture.image = canvas;
  texture.needsUpdate = true;
}

function disposeModel(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      if (!material) return;
      Object.values(material).forEach((value) => {
        if (value && typeof value === "object" && "isTexture" in value && (value as THREE.Texture).isTexture) {
          (value as THREE.Texture).dispose();
        }
      });
      material.dispose();
    });
  });
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function setRobotState(state: "loading" | "ready" | "fallback" | "error") {
  if (typeof document !== "undefined") {
    document.body.dataset.robot = state;
  }
}

export interface InitRobotSceneParams {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  prefersReducedMotion?: boolean;
}

export function initRobotScene({ stage, canvas, prefersReducedMotion = false }: InitRobotSceneParams) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    setRobotState("fallback");
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.lookAt(0, 0, 0);
  const viewHeightWorld = 2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));

  // Lighting tuned for the dark/gold portfolio palette
  const keyLight = new THREE.DirectionalLight(0xfff5dd, 3.8);
  keyLight.position.set(4, 6, 6);
  const rimLight = new THREE.DirectionalLight(0xedd49a, 2.6);
  rimLight.position.set(-4, 3, -2);
  const ambientLight = new THREE.HemisphereLight(0xfdfaf2, 0x14161a, 2.4);
  scene.add(keyLight, rimLight, ambientLight);

  // robotRoot: screen placement (position + scale), driven by GSAP quickTo.
  // pose: yaw toward content + pointer tracking + idle bob.
  const robotRoot = new THREE.Group();
  const pose = new THREE.Group();
  robotRoot.add(pose);
  scene.add(robotRoot);

  let model: THREE.Group | null = null;
  let mixer: THREE.AnimationMixer | null = null;
  let activeAction: THREE.AnimationAction | null = null;
  let desiredClip: string | null = ANCHORS.hero.clip;
  let disposed = false;
  const actions = new Map<string, THREE.AnimationAction>();
  // THREE.Clock is deprecated as of r185; Timer is its replacement.
  const timer = new THREE.Timer();

  const playClip = (name: string, fadeDuration = 0.45) => {
    desiredClip = name;
    if (prefersReducedMotion && activeAction) return;
    const nextAction = actions.get(name);
    if (!nextAction || nextAction === activeAction) return;
    nextAction.reset().fadeIn(fadeDuration).play();
    activeAction?.fadeOut(fadeDuration);
    activeAction = nextAction;
    if (prefersReducedMotion && mixer) mixer.update(0);
  };

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    MODEL_URL,
    (gltf) => {
      if (disposed) {
        disposeModel(gltf.scene);
        return;
      }

      model = gltf.scene;
      model.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => {
          const map = material ? (material as THREE.MeshStandardMaterial).map : null;
          if (map) {
            retintTexture(map);
            map.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          }
        });
      });

      // Normalise to 1 world unit tall with feet on the ground origin
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.scale.setScalar(1 / Math.max(size.y, 0.001));
      const fitted = new THREE.Box3().setFromObject(model);
      const center = fitted.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -fitted.min.y, -center.z);
      pose.add(model);

      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        const action = mixer!.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        actions.set(clip.name, action);
      });

      renderer.compile(scene, camera);
      setRobotState("ready");
      const clip = desiredClip ?? "Look_Wave";
      desiredClip = null;
      playClip(clip, 0);
    },
    undefined,
    () => {
      if (!disposed) setRobotState("error");
    },
  );

  // --- Layout anchors -------------------------------------------------------
  interface MeasuredAnchor {
    element: HTMLElement;
    clip: string;
    turn: number;
    fit: number;
  }

  const queryAnchors = (): MeasuredAnchor[] => {
    return Array.from(document.querySelectorAll<HTMLElement>("[data-robot-anchor]"))
      .map((element) => {
        const key = element.dataset.robotAnchor ?? "";
        const cfg = ANCHORS[key] || { clip: "Look_Wave", turn: 0, fit: 1 };
        return { element, ...cfg };
      })
      .filter((a) => Boolean(a.clip));
  };

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;

  const measureAnchor = (anchor: MeasuredAnchor) => {
    const rect = anchor.element.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      bottom: rect.bottom,
      height: rect.height * anchor.fit,
      turn: anchor.turn,
    };
  };

  // Where the robot should be this frame, in CSS pixels.
  const resolveTarget = () => {
    const anchors = queryAnchors();
    const boxes = anchors.map(measureAnchor).filter(Boolean) as NonNullable<ReturnType<typeof measureAnchor>>[];
    if (!boxes.length) return null;
    const focus = viewportHeight * 0.5;
    if (focus <= boxes[0].cy) return boxes[0];
    for (let i = 0; i < boxes.length - 1; i += 1) {
      const from = boxes[i];
      const to = boxes[i + 1];
      if (focus > to.cy) continue;
      // Stay parked on each anchor for the first/last 30% of the gap, travel in between.
      const t = smoothstep(0.3, 0.7, (focus - from.cy) / (to.cy - from.cy));
      return {
        cx: lerp(from.cx, to.cx, t),
        bottom: lerp(from.bottom, to.bottom, t),
        height: lerp(from.height, to.height, t),
        turn: lerp(from.turn, to.turn, t),
      };
    }
    return boxes[boxes.length - 1];
  };

  const duration = prefersReducedMotion ? 0.01 : 0.35;
  const moveX = gsap.quickTo(robotRoot.position, "x", { duration, ease: "power3.out" });
  const moveY = gsap.quickTo(robotRoot.position, "y", { duration, ease: "power3.out" });
  const moveScale = gsap.quickTo(robotRoot.scale, "x", {
    duration,
    ease: "power3.out",
    onUpdate: () => robotRoot.scale.setScalar(robotRoot.scale.x),
  });
  const turnTo = gsap.quickTo(pose.rotation, "y", { duration: 0.8, ease: "power2.out" });

  let placed = false;
  const placeRobot = () => {
    const target = resolveTarget();
    if (!target) return;
    const worldPerPx = viewHeightWorld / viewportHeight;
    const x = (target.cx - viewportWidth / 2) * worldPerPx;
    const y = (viewportHeight / 2 - target.bottom) * worldPerPx;
    const scale = target.height * worldPerPx;

    if (!placed) {
      gsap.set(robotRoot.position, { x, y });
      robotRoot.scale.setScalar(scale);
      placed = true;
    }
    moveX(x);
    moveY(y);
    moveScale(scale);
    turnTo(target.turn);
  };

  // --- Render loop ----------------------------------------------------------
  let targetPointerX = 0;
  let targetPointerY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let elapsed = 0;
  let animationFrame = 0;
  let wasOffScreen = false;

  const handlePointerMove = (event: MouseEvent) => {
    targetPointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetPointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  const resizeRenderer = () => {
    viewportWidth = stage.clientWidth || window.innerWidth;
    viewportHeight = stage.clientHeight || window.innerHeight;
    renderer.setSize(viewportWidth, viewportHeight, false);
    camera.aspect = viewportWidth / Math.max(viewportHeight, 1);
    camera.updateProjectionMatrix();
  };

  const animate = () => {
    animationFrame = 0;
    timer.update();
    const delta = Math.min(timer.getDelta(), 0.05);

    placeRobot();

    // Check if on-screen
    const worldPerPx = viewHeightWorld / viewportHeight;
    const bottomPx = viewportHeight / 2 - robotRoot.position.y / worldPerPx;
    const heightPx = robotRoot.scale.y / worldPerPx;
    const onScreen = bottomPx > -80 && bottomPx - heightPx < viewportHeight + 80;
    if (model && !onScreen && wasOffScreen) return;
    animationFrame = window.requestAnimationFrame(animate);
    if (!model) return;
    wasOffScreen = !onScreen;

    elapsed += delta;
    if (!prefersReducedMotion) mixer?.update(delta);

    pointerX += (targetPointerX - pointerX) * 0.05;
    pointerY += (targetPointerY - pointerY) * 0.05;
    if (!prefersReducedMotion) {
      // Head/body follows pointer on top of section yaw
      model.rotation.y = pointerX * 0.35;
      model.rotation.x = pointerY * 0.08;
      pose.position.y = Math.sin(elapsed * 1.6) * 0.014;
    }

    renderer.render(scene, camera);
  };

  const wake = () => {
    if (animationFrame || disposed) return;
    // Restart the frame clock so the time spent parked is not one huge step.
    timer.update();
    animationFrame = window.requestAnimationFrame(animate);
  };

  const handleResize = () => {
    resizeRenderer();
    wake();
  };

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", handleResize);
  resizeRenderer();
  animate();

  // --- Scroll-driven clip changes (GSAP ScrollTrigger) ----------------------
  const animationContext = gsap.context(() => {
    const anchors = queryAnchors();
    const sections = gsap.utils.toArray<HTMLElement>("main section, header, footer");
    const lastAnchorElement = anchors.length ? anchors[anchors.length - 1].element : null;
    const lastAnchorSection = lastAnchorElement ? lastAnchorElement.closest("section") : null;
    const lastAnchorIndex = lastAnchorSection ? sections.indexOf(lastAnchorSection) : -1;

    sections.forEach((section, index) => {
      const anchorElement = section.querySelector<HTMLElement>("[data-robot-anchor]");
      const anchorClip = anchorElement ? ANCHORS[anchorElement.dataset.robotAnchor || ""]?.clip : null;
      const clip =
        anchorClip ??
        (index > lastAnchorIndex && lastAnchorSection
          ? ANCHORS[lastAnchorSection.querySelector<HTMLElement>("[data-robot-anchor]")?.dataset.robotAnchor || ""]?.clip
          : TRAVEL_CLIP);

      if (!clip) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) playClip(clip);
        },
      });
    });
  });

  return () => {
    disposed = true;
    animationContext.revert();
    gsap.killTweensOf([robotRoot.position, robotRoot.scale, pose.rotation]);
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("scroll", wake);
    window.removeEventListener("resize", handleResize);
    if (model) disposeModel(model);
    mixer?.stopAllAction();
    timer.dispose();
    renderer.dispose();
    if (typeof document !== "undefined") {
      delete document.body.dataset.robot;
    }
  };
}
