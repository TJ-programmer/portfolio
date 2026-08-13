"use client";

/* eslint-disable react-hooks/purity -- random scene-data generation during render is standard for three.js */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

gsap.registerPlugin(ScrollTrigger);

export type SceneTheme = "night" | "day";

const SCENE = {
  night: {
    bg: "#04050a",
    fog: "#04050a",
    ambient: 0.4,
    pointKey: 70,
    pointSteel: 22,
    pointSide: 24,
    pointBack: 30,
    pointRim: 26,
    ringGold: "#ffd84d",
    ringSteel: "#6d7888",
    ringA: 0.3,
    ringB: 0.16,
    rainColor: "#3d4f68",
    rainOpacity: 0.34,
    rainBlend: THREE.AdditiveBlending,
    beamColor: "#ffd84d",
    beamBase: 0.07,
    beamTint: 0.02,
    galaxyGold: "1.0, 0.847, 0.302",
    galaxySteel: "0.29, 0.34, 0.42",
    galaxyMix: 0.38,
    galaxyAlpha: 0.9,
    galaxyBlend: THREE.AdditiveBlending,
    linkGold: "#ffd84d",
    linkSteel: "#8a9bb0",
    linkA: 0.14,
  },
  day: {
    bg: "#cfe4ff",
    fog: "#e3f0ff",
    ambient: 1.0,
    pointKey: 26,
    pointSteel: 12,
    pointSide: 14,
    pointBack: 14,
    pointRim: 12,
    ringGold: "#d99a2b",
    ringSteel: "#3f5f95",
    ringA: 0.5,
    ringB: 0.3,
    rainColor: "#5f82b8",
    rainOpacity: 0.35,
    rainBlend: THREE.NormalBlending,
    beamColor: "#fff3c8",
    beamBase: 0.14,
    beamTint: 0.03,
    galaxyGold: "1.0, 0.78, 0.22",
    galaxySteel: "0.24, 0.36, 0.55",
    galaxyMix: 0.7,
    galaxyAlpha: 0.8,
    galaxyBlend: THREE.NormalBlending,
    linkGold: "#c08a1c",
    linkSteel: "#3f5f95",
    linkA: 0.22,
  },
} as const;

export default function NeuralScene({ theme = "night" }: { theme?: SceneTheme }) {
  const c = SCENE[theme];
  const isDay = theme === "day";
  return (
    <div className="scene-shell" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 54 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.12 }}
      >
        <color attach="background" args={[c.bg]} />
        <fog attach="fog" args={[c.fog, 9, 26]} />
        <ambientLight intensity={c.ambient} />
        <pointLight position={[0, 6, 4]} color="#ffd84d" intensity={c.pointKey} />
        <pointLight position={[-6, -4, 5]} color="#3c4757" intensity={c.pointSteel} />
        <pointLight position={[6, 2, 3]} color="#ffd84d" intensity={c.pointSide} />
        <pointLight position={[0, 2.5, -6]} color="#9fb3d1" intensity={c.pointBack} />
        <pointLight position={[3.5, 4.5, 5]} color="#dfe8ff" intensity={c.pointRim} />
        <CameraRig />
        {isDay ? null : <Stars radius={110} depth={60} count={1400} factor={3} fade speed={0.35} />}
        <EnvironmentProbe />
        <BatmanEmblem theme={theme} />
        <ParticleGalaxy theme={theme} />
        <PipelineRings theme={theme} />
        <GothamRain theme={theme} />
        <BatSignalBeam theme={theme} />
        <LightningController />
      </Canvas>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bat logo silhouette (3D emblem) — classic symbol: pointed ears,      */
/* rounded head, notched wings sweeping wide, tapered tail.             */
/* Right half authored once, mirrored for perfect symmetry.             */
/* ------------------------------------------------------------------ */
function batShape(): THREE.Shape {
  const right: [number, number][] = [
    [55, 6],
    [59, 12],
    [61, 18],
    [62, 23],
    [61, 27],
    [63, 30],
    [62, 34],
    [61, 40],
    [63, 47],
    [66, 50],
    [62, 45],
    [57, 41],
    [52, 38],
    [46, 36],
    [40, 34],
    [33, 33],
    [26, 34],
    [19, 36],
    [13, 39],
    [8, 43],
    [4, 47],
    [0, 50],
    [6, 45],
    [12, 41],
    [17, 39],
    [23, 37],
    [30, 36],
    [36, 38],
    [40, 34],
    [42, 28],
    [41, 22],
    [37, 18],
    [32, 17],
    [27, 19],
    [25, 23],
    [27, 27],
    [31, 28],
    [37, 27],
    [43, 25],
    [47, 21],
    [49, 14],
  ];

  const pts: [number, number][] = [[50, 0]];
  right.forEach((p) => pts.push(p));
  for (let i = right.length - 1; i >= 0; i--) {
    pts.push([100 - right[i][0], right[i][1]]);
  }
  pts.push([50, 0]);

  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const px = (x / 100) * 5.4 - 2.7;
    const py = (y / 50) * 2.5 - 1.25;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  shape.closePath();
  return shape;
}

/* ------------------------------------------------------------------ */
/* 3D bat emblem: extruded gold logo, glow halo, orbit ring, tumbling   */
/* across the scroll, idle breathing + mouse tilt.                      */
/* ------------------------------------------------------------------ */
function BatmanEmblem({ theme }: { theme: SceneTheme }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const glowMat = useRef<THREE.SpriteMaterial>(null);
  const halo = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(batShape(), {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.14,
      bevelSegments: 5,
      steps: 1,
    });
    geo.center();
    return geo;
  }, []);

  const glowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    if (!g) return null;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255, 224, 130, 0.9)");
    grad.addColorStop(0.4, "rgba(255, 200, 90, 0.35)");
    grad.addColorStop(1, "rgba(255, 190, 80, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.fromTo(
      outer.current!.rotation,
      { y: 0.15, x: -0.3 },
      {
        y: Math.PI * 2.05,
        x: 0.42,
        duration: 1,
        scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: 1.2 },
      },
      0,
    );
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (inner.current) {
      inner.current.rotation.y = Math.sin(t * 0.32) * 0.5 + mouse.current.x * 0.14;
      inner.current.rotation.x = Math.cos(t * 0.24) * 0.12 + mouse.current.y * 0.1;
      inner.current.position.y = Math.sin(t * 0.7) * 0.12;
    }
    if (glowMat.current) {
      const g = 0.5 + Math.sin(t * 1.7) * 0.18;
      glowMat.current.opacity = (theme === "day" ? 0.32 : 0.7) * g;
    }
    if (halo.current) {
      halo.current.rotation.z = t * 0.12;
      halo.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
  });

  const gold = theme === "day" ? "#c08a1c" : "#ffd84d";

  return (
    <group ref={outer} position={[0, 0.1, 0]}>
      <group ref={inner} position={[0, 0.35, 0]}>
        <sprite scale={[8.4, 4, 1]} position={[0, 0, -0.55]}>
          <spriteMaterial
            ref={glowMat}
            map={glowTex}
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        <mesh geometry={geometry} scale={1.45}>
          <meshStandardMaterial
            color="#e2a63c"
            metalness={0.92}
            roughness={0.3}
            emissive="#6a3d05"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <mesh ref={halo} rotation={[1.85, 0.2, 0]} position={[0, 0.35, 0]}>
        <torusGeometry args={[3.05, 0.018, 8, 140]} />
        <meshBasicMaterial color={gold} transparent opacity={theme === "day" ? 0.4 : 0.28} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Particle galaxy: gold/steel dust reacting to the cursor              */
/* ------------------------------------------------------------------ */
function ParticleGalaxy({ theme }: { theme: SceneTheme }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const c = SCENE[theme];

  const { positions, connections } = useMemo(() => {
    const count = 520;
    const pts = new Float32Array(count * 3);
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.sin(i * 0.31) * 0.7 + Math.random() * 0.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.75;
      const z = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3] = x;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = z;
      if (i % 22 === 0) nodes.push(new THREE.Vector3(x, y, z));
    }

    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      lines.push([nodes[i], nodes[i + 1]]);
      if (nodes[i + 3]) lines.push([nodes[i], nodes[i + 3]]);
    }
    return { positions: pts, connections: lines };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.05 + mouse.current.x * 0.2;
      pointsRef.current.rotation.x = mouse.current.y * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value = mouse.current;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={c.galaxyBlend}
          uniforms={{
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
          }}
          vertexShader={`
            uniform float uTime;
            uniform vec2 uMouse;
            varying float vPulse;
            void main() {
              vec3 pos = position;
              float wave = sin(position.x * 2.8 + uTime * 1.1) * 0.09;
              pos += normalize(position) * wave;
              pos.x += uMouse.x * 0.12;
              pos.y += uMouse.y * 0.08;
              vPulse = wave;
              vec4 mv = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = 3.2 * (8.0 / -mv.z);
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={`
            varying float vPulse;
            void main() {
              float d = distance(gl_PointCoord, vec2(0.5));
              float alpha = smoothstep(0.5, 0.04, d);
              vec3 gold = vec3(${c.galaxyGold});
              vec3 steel = vec3(${c.galaxySteel});
              vec3 col = mix(gold, steel, ${c.galaxyMix} + vPulse * 2.0);
              gl_FragColor = vec4(col, alpha * ${c.galaxyAlpha});
            }
          `}
        />
      </points>
      {connections.map(([a, b], i) => (
        <line key={`${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={i % 3 === 0 ? c.linkGold : c.linkSteel}
            transparent
            opacity={c.linkA}
          />
        </line>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Radar / pipeline rings                                               */
/* ------------------------------------------------------------------ */
function PipelineRings({ theme }: { theme: SceneTheme }) {
  const groupRef = useRef<THREE.Group>(null);
  const c = SCENE[theme];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.elapsedTime * 0.035;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.16) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {[3.2, 3.9, 4.6, 5.3].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.16, i * 0.3, 0]}>
          <torusGeometry args={[r, 0.004, 8, 180]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? c.ringGold : c.ringSteel}
            transparent
            opacity={i === 1 ? c.ringA : c.ringB}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Gotham rain: falling line streaks                                    */
/* ------------------------------------------------------------------ */
const RAIN_COUNT = 480;

function GothamRain({ theme }: { theme: SceneTheme }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const c = SCENE[theme];

  const { positions, speeds } = useMemo(() => {
    const arr = new Float32Array(RAIN_COUNT * 2 * 3);
    const spd = new Float32Array(RAIN_COUNT);
    for (let i = 0; i < RAIN_COUNT; i++) {
      arr[i * 6] = (Math.random() - 0.5) * 26;
      arr[i * 6 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 6 + 2] = (Math.random() - 0.5) * 10 - 3;
      arr[i * 6 + 3] = arr[i * 6] - 0.09;
      arr[i * 6 + 4] = arr[i * 6 + 1] - 0.34;
      arr[i * 6 + 5] = arr[i * 6 + 2];
      spd[i] = 0.09 + Math.random() * 0.1;
    }
    return { positions: arr, speeds: spd };
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;
    const pos = linesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const fall = speeds[i];
      pos[i * 6 + 1] -= fall;
      pos[i * 6 + 4] -= fall;
      pos[i * 6] -= 0.012;
      pos[i * 6 + 3] -= 0.012;
      if (pos[i * 6 + 1] < -9) {
        const y = 9;
        const x = (Math.random() - 0.5) * 26;
        pos[i * 6] = x;
        pos[i * 6 + 1] = y;
        pos[i * 6 + 3] = x - 0.09;
        pos[i * 6 + 4] = y - 0.34;
      }
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={c.rainColor} transparent opacity={c.rainOpacity} blending={c.rainBlend} />
    </lineSegments>
  );
}

/* ------------------------------------------------------------------ */
/* Bat-signal: beam cast down from the sky onto the emblem              */
/* ------------------------------------------------------------------ */
function BatSignalBeam({ theme }: { theme: SceneTheme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const c = SCENE[theme];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.16;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = c.beamBase + Math.sin(t * 0.8) * c.beamTint;
  });

  return (
    <mesh ref={meshRef} position={[0, 3.2, -3]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[4.2, 10, 32, 1, true]} />
      <meshBasicMaterial color={c.beamColor} transparent opacity={c.beamBase} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Lightning: random flashes + brief camera shake                       */
/* ------------------------------------------------------------------ */
function LightningController() {
  const flashRef = useRef<THREE.Sprite>(null);
  const flashMatRef = useRef<THREE.SpriteMaterial>(null);
  const shakeRef = useRef(0);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const flashTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,240,190,1)");
    grad.addColorStop(0.55, "rgba(255,216,77,0.4)");
    grad.addColorStop(1, "rgba(255,216,77,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const strike = () => {
      if (cancelled) return;
      if (flashMatRef.current) {
        flashMatRef.current.opacity = 1;
        gsap.to(flashMatRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
      }
      shakeRef.current = 0.12;
      gsap.to(shakeRef, { current: 0, duration: 0.6, ease: "power3.out" });
      timeout = setTimeout(strike, 3500 + Math.random() * 6500);
    };

    timeout = setTimeout(strike, 2200);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  useFrame(() => {
    const cam = cameraRef.current;
    if (!cam || !flashRef.current) return;
    flashRef.current.position.copy(cam.position);
    const dir = cam.getWorldDirection(new THREE.Vector3());
    flashRef.current.position.addScaledVector(dir, 4);
    flashRef.current.lookAt(cam.position);

    if (shakeRef.current > 0.001) {
      const s = shakeRef.current;
      cam.position.x += (Math.random() - 0.5) * s;
      cam.position.y += (Math.random() - 0.5) * s;
    }
  });

  return (
    <sprite ref={flashRef} scale={[34, 22, 1]}>
      <spriteMaterial
        ref={flashMatRef}
        map={flashTex}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

/* ------------------------------------------------------------------ */
/* Studio environment so metals get something to reflect                */
/* ------------------------------------------------------------------ */
function EnvironmentProbe() {
  const { gl, scene } = useThree();
  const sceneRef = useRef(scene);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const s = sceneRef.current;
    s.environment = env;
    s.environmentIntensity = 0.45;
    return () => {
      s.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

/* ------------------------------------------------------------------ */
/* Camera rig: GSAP scroll-driven flythrough                            */
/* ------------------------------------------------------------------ */
function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });

    tl.to(camera.position, { x: 1.9, y: -0.6, z: 6.4, ease: "none" })
      .to(camera.position, { x: -1.6, y: 0.7, z: 7.1, ease: "none" })
      .to(camera.position, { x: 0.5, y: -0.3, z: 7.7, ease: "none" })
      .to(camera.position, { x: 0, y: 0, z: 8.4, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [camera]);

  useFrame(() => camera.lookAt(0, 0, 0));
  return null;
}
