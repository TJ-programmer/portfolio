"use client";

/* eslint-disable react-hooks/purity -- random scene-data generation during render is standard for three.js */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function NeuralScene() {
  return (
    <div className="scene-shell" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 54 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#04050a"]} />
        <fog attach="fog" args={["#04050a", 9, 26]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 6, 4]} color="#ffd84d" intensity={70} />
        <pointLight position={[-6, -4, 5]} color="#3c4757" intensity={22} />
        <pointLight position={[6, 2, 3]} color="#ffd84d" intensity={24} />
        <pointLight position={[0, 2.5, -6]} color="#9fb3d1" intensity={30} />
        <pointLight position={[3.5, 4.5, 5]} color="#dfe8ff" intensity={26} />
        <CameraRig />
        <Stars radius={110} depth={60} count={1400} factor={3} fade speed={0.35} />
        <FigureStage />
        <ParticleGalaxy />
        <PipelineRings />
        <GothamRain />
        <BatSignalBeam />
        <LightningController />
      </Canvas>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bat logo silhouette (reused for the chest emblem)                    */
/* ------------------------------------------------------------------ */
function batShape(): THREE.Shape {
  const pts: [number, number][] = [
    [0, 18],
    [14, 8],
    [27, 20],
    [37, 4],
    [50, 16],
    [63, 4],
    [73, 20],
    [86, 8],
    [100, 18],
    [82, 28],
    [62, 24],
    [50, 38],
    [38, 24],
    [18, 28],
  ];
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const px = (x / 100) * 5 - 2.5;
    const py = (y / 44) * 2.2 - 1.1;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  shape.closePath();
  return shape;
}

/* ------------------------------------------------------------------ */
/* The Dark Knight: procedural armored figure with an animated cape     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Photo stage: load public/images/batman-1..6.jpg and cut them into a  */
/* scroll-driven sequence; fall back to the procedural figure.          */
/* ------------------------------------------------------------------ */
const PHOTO_PATHS = [
  "/images/batman-1.jpg",
  "/images/batman-2.jpg",
  "/images/batman-3.jpg",
  "/images/batman-4.jpg",
  "/images/batman-5.jpg",
  "/images/batman-6.jpg",
];

const PHOTO_SLOTS = [
  { id: 0, pos: [0.75, 0.1, 0] as const, dir: -1, rotY: 0.06, scale: 1.0 },
  { id: 1, pos: [-0.9, 0.0, -0.6] as const, dir: 1, rotY: -0.08, scale: 0.95 },
  { id: 2, pos: [0.85, -0.2, -1.0] as const, dir: -1, rotY: 0.1, scale: 0.9 },
  { id: 3, pos: [-0.85, 0.1, -0.8] as const, dir: 1, rotY: -0.06, scale: 0.95 },
  { id: 4, pos: [0.8, 0.0, -0.4] as const, dir: -1, rotY: 0.08, scale: 1.0 },
  { id: 5, pos: [-0.8, 0.2, 0] as const, dir: 1, rotY: -0.1, scale: 1.0 },
];

function FigureStage() {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();
    const results: (THREE.Texture | null)[] = [];
    let pending = PHOTO_PATHS.length;

    PHOTO_PATHS.forEach((p, i) => {
      loader.load(
        p,
        (t) => {
          if (!alive) {
            t.dispose();
            return;
          }
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
          results[i] = t;
          if (--pending === 0) {
            setTextures(results.filter(Boolean) as THREE.Texture[]);
          }
        },
        undefined,
        () => {
          results[i] = null;
          if (--pending === 0) {
            setTextures(results.filter(Boolean) as THREE.Texture[]);
          }
        }
      );
    });

    return () => {
      alive = false;
    };
  }, []);

  if (textures.length === 0) return <BatmanFigure />;
  return <PhotoSequence textures={textures} />;
}

function PhotoSequence({ textures }: { textures: THREE.Texture[] }) {
  const outerRefs = useRef<(THREE.Group | null)[]>([]);
  const opacityUniforms = useRef<({ value: number } | null)[]>([]);
  const haloMats = useRef<(THREE.SpriteMaterial | null)[]>([]);

  const onOuter = useCallback((i: number, el: THREE.Group | null) => {
    outerRefs.current[i] = el;
  }, []);
  const onOpacity = useCallback((i: number, u: { value: number } | null) => {
    opacityUniforms.current[i] = u;
  }, []);
  const onHalo = useCallback((i: number, m: THREE.SpriteMaterial | null) => {
    haloMats.current[i] = m;
  }, []);

  useEffect(() => {
    const n = textures.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const win = 1 / n;

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: reduceMotion
        ? undefined
        : {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
    });

    for (let i = 0; i < n; i++) {
      const out = outerRefs.current[i];
      const opU = opacityUniforms.current[i];
      const halo = haloMats.current[i];
      const slot = PHOTO_SLOTS[i % PHOTO_SLOTS.length];
      if (!out || !opU || !halo) continue;

      const [bx, by, bz] = slot.pos;
      const dir = slot.dir;
      const start = i * win;

      gsap.set(out.position, { x: bx - dir * 2.6, y: by + 1.8, z: bz - 1.0 });
      gsap.set(out.rotation, { y: dir * 0.5 });
      gsap.set(out.scale, { x: 0.86, y: 0.86, z: 0.86 });
      opU.value = 0;
      halo.opacity = 0;

      if (reduceMotion) {
        gsap.set(out.position, { x: bx, y: by, z: bz });
        gsap.set(out.rotation, { y: slot.rotY });
        gsap.set(out.scale, { x: slot.scale, y: slot.scale, z: slot.scale });
        opU.value = 1;
        halo.opacity = 0.3;
        continue;
      }

      tl.to(out.position, { x: bx, y: by, z: bz, duration: 0.14, ease: "power2.out" }, start + 0.01)
        .to(out.rotation, { y: slot.rotY, duration: 0.14, ease: "power2.out" }, start + 0.01)
        .to(
          out.scale,
          { x: slot.scale, y: slot.scale, z: slot.scale, duration: 0.14, ease: "power2.out" },
          start + 0.01
        )
        .to(opU, { value: 1, duration: 0.12 }, start + 0.01)
        .to(halo, { opacity: 0.32, duration: 0.12 }, start + 0.01)
        .to(
          out.position,
          { x: bx + dir * 2.4, y: by - 0.5, z: bz + 0.8, duration: 0.14, ease: "power2.in" },
          start + win - 0.15
        )
        .to(out.rotation, { y: -dir * 0.42, duration: 0.14 }, start + win - 0.15)
        .to(
          out.scale,
          { x: 1.06, y: 1.06, z: 1.06, duration: 0.14 },
          start + win - 0.15
        )
        .to(opU, { value: 0, duration: 0.12 }, start + win - 0.13)
        .to(halo, { opacity: 0, duration: 0.12 }, start + win - 0.13);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [textures.length]);

  return (
    <>
      {textures.map((tex, i) => (
        <BatmanImage
          key={i}
          tex={tex}
          slot={PHOTO_SLOTS[i % PHOTO_SLOTS.length]}
          onOuter={onOuter}
          onOpacity={onOpacity}
          onHalo={onHalo}
        />
      ))}
    </>
  );
}

function BatmanImage({
  tex,
  slot,
  onOuter,
  onOpacity,
  onHalo,
}: {
  tex: THREE.Texture;
  slot: (typeof PHOTO_SLOTS)[number];
  onOuter: (i: number, el: THREE.Group | null) => void;
  onOpacity: (i: number, u: { value: number } | null) => void;
  onHalo: (i: number, m: THREE.SpriteMaterial | null) => void;
}) {
  const innerRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  const size = useMemo<[number, number]>(() => {
    const img = tex.image as { width?: number; height?: number } | undefined;
    if (img && img.width && img.height) {
      const H = 5.6;
      const W = Math.min((img.width / img.height) * H, 4.4);
      return [W, H];
    }
    return [3.6, 5.6];
  }, [tex]);

  const haloTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,216,77,0.5)");
    grad.addColorStop(0.45, "rgba(255,216,77,0.14)");
    grad.addColorStop(1, "rgba(255,216,77,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTexture: { value: tex },
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uTime;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv + vec2(
              sin(vUv.y * 8.0 + uTime * 1.3) * 0.002,
              cos(vUv.x * 8.0 + uTime * 1.3) * 0.002
            );
            vec4 col = texture2D(uTexture, uv);

            float edgeX = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
            float edgeY = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
            float edge = 1.0 - min(edgeX, edgeY);
            edge = smoothstep(0.3, 0.85, edge);

            float flicker = 0.72 + 0.28 * sin(uTime * 6.0) * sin(uTime * 2.3);

            vec3 glow = vec3(1.0, 0.847, 0.302) * edge * 0.55 * flicker;
            vec3 rgb = col.rgb * 1.06 + glow;
            rgb += vec3(0.85, 0.9, 1.0) * 0.16 * smoothstep(0.0, 0.4, 1.0 - vUv.y) * flicker;

            float vg = smoothstep(0.85, 0.35, length(vUv - 0.5) * 1.4);
            rgb *= 0.72 + 0.28 * vg;

            rgb = 1.0 - exp(-rgb * 1.15);
            rgb = pow(rgb, vec3(1.0 / 2.2));

            float alpha = edgeX * edgeY * 0.98 * uOpacity;
            gl_FragColor = vec4(rgb, alpha);
          }
        `,
      }),
    [tex]
  );

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (innerRef.current) {
      innerRef.current.position.y = Math.sin(t * 0.8 + slot.id * 2.0) * 0.05;
      innerRef.current.rotation.y = pointer.x * 0.25;
      innerRef.current.rotation.x = -pointer.y * 0.05;
      const s = 1 + Math.sin(t * 1.2 + slot.id * 2.0) * 0.006;
      innerRef.current.scale.setScalar(s);
    }
    const m = planeRef.current?.material as THREE.ShaderMaterial | undefined;
    if (m) {
      m.uniforms.uTime.value = t;
    }
  });

  useEffect(() => {
    onOpacity(slot.id, mat.uniforms.uOpacity);
  }, [mat, onOpacity, slot.id]);

  return (
    <group ref={(el) => onOuter(slot.id, el)} position={[slot.pos[0], slot.pos[1], slot.pos[2]]}>
      <sprite position={[0, 0, -0.9]} scale={[size[0] + 1.6, size[1] + 1.2, 1]}>
        <spriteMaterial
          ref={(m) => onHalo(slot.id, m)}
          map={haloTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <group ref={innerRef}>
        <mesh ref={planeRef} material={mat}>
          <planeGeometry args={[size[0], size[1]]} />
        </mesh>
      </group>
    </group>
  );
}

function BatmanFigure() {
  const groupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Group>(null);
  const capeMeshRef = useRef<THREE.Mesh>(null);

  const armor = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#16181f", metalness: 0.72, roughness: 0.36 }),
    []
  );
  const armorDark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0b0d12", metalness: 0.6, roughness: 0.5 }),
    []
  );
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2a2f38", metalness: 0.85, roughness: 0.28 }),
    []
  );
  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffd84d",
        metalness: 1,
        roughness: 0.24,
        emissive: "#ffd84d",
        emissiveIntensity: 0.3,
      }),
    []
  );
  const capeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0c11",
        roughness: 0.9,
        metalness: 0.3,
        side: THREE.DoubleSide,
      }),
    []
  );
  const eyeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#fff6d8" }), []);

  const emblemGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(batShape(), { depth: 0.06, bevelEnabled: false });
    geo.center();
    geo.scale(0.1, 0.1, 1);
    return geo;
  }, []);

  const { geometry: capeGeo, base } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.4, 2.7, 14, 16);
    geo.translate(0, -2.7 / 2, 0);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const base = new Float32Array(pos.array as Float32Array);
    return { geometry: geo, base };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = -0.25 + Math.sin(t * 1.4) * 0.05;
      groupRef.current.rotation.y = pointer.x * 0.28 + Math.sin(t * 0.32) * 0.1;
      groupRef.current.rotation.x = pointer.y * 0.08;
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
    }
    if (torsoRef.current) {
      torsoRef.current.scale.y = 1 + Math.sin(t * 1.6) * 0.012;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.45) * 0.22;
    }
    if (capeRef.current) {
      capeRef.current.rotation.y = Math.sin(t * 0.8) * 0.09;
      const geo = capeMeshRef.current?.geometry;
      if (geo) {
        const pos = geo.attributes.position as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          const x = base[i];
          const y = base[i + 1];
          const depth = (y + 2.7) / 2.7;
          const sway =
            Math.sin(t * 1.9 + x * 1.4 + y * 0.9) * 0.26 * depth +
            Math.sin(t * 1.1 + y * 2.4) * 0.1 * depth;
          arr[i] = x + Math.sin(t * 1.3 + y * 1.1) * 0.07 * depth;
          arr[i + 1] = y;
          arr[i + 2] = sway;
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
      }
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        {/* legs */}
        <mesh material={armor} position={[-0.28, -0.95, 0]}>
          <boxGeometry args={[0.42, 1.15, 0.42]} />
        </mesh>
        <mesh material={armor} position={[0.28, -0.95, 0]}>
          <boxGeometry args={[0.42, 1.15, 0.42]} />
        </mesh>
        {/* boots */}
        <mesh material={armorDark} position={[-0.28, -1.68, 0.06]}>
          <boxGeometry args={[0.5, 0.34, 0.72]} />
        </mesh>
        <mesh material={armorDark} position={[0.28, -1.68, 0.06]}>
          <boxGeometry args={[0.5, 0.34, 0.72]} />
        </mesh>
        <mesh material={gold} position={[-0.28, -1.52, 0.4]}>
          <boxGeometry args={[0.14, 0.05, 0.04]} />
        </mesh>
        <mesh material={gold} position={[0.28, -1.52, 0.4]}>
          <boxGeometry args={[0.14, 0.05, 0.04]} />
        </mesh>

        {/* belt */}
        <mesh material={armorDark} position={[0, -0.42, 0]}>
          <boxGeometry args={[0.98, 0.24, 0.4]} />
        </mesh>
        <mesh material={gold} position={[0, -0.42, 0.22]}>
          <boxGeometry args={[0.26, 0.18, 0.06]} />
        </mesh>

        {/* torso */}
        <mesh ref={torsoRef} material={armor} position={[0, 0.18, 0]}>
          <boxGeometry args={[1.0, 1.15, 0.6]} />
        </mesh>
        <mesh material={steel} position={[0, 0.3, 0.04]}>
          <boxGeometry args={[1.04, 0.8, 0.62]} />
        </mesh>
        <mesh material={armorDark} position={[0, -0.06, 0.06]}>
          <boxGeometry args={[0.6, 0.68, 0.54]} />
        </mesh>
        {/* chest emblem */}
        <mesh geometry={emblemGeo} material={gold} position={[0, 0.3, 0.34]} />

        {/* shoulders */}
        <mesh material={armor} position={[-0.62, 0.78, 0]}>
          <sphereGeometry args={[0.34, 24, 20]} />
        </mesh>
        <mesh material={armor} position={[0.62, 0.78, 0]}>
          <sphereGeometry args={[0.34, 24, 20]} />
        </mesh>
        <mesh material={steel} position={[-0.62, 1.06, 0]}>
          <coneGeometry args={[0.12, 0.24, 16]} />
        </mesh>
        <mesh material={steel} position={[0.62, 1.06, 0]}>
          <coneGeometry args={[0.12, 0.24, 16]} />
        </mesh>

        {/* arms */}
        <mesh material={armor} position={[-0.68, 0.4, 0]} rotation={[0, 0, 0.14]}>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
        </mesh>
        <mesh material={armor} position={[0.68, 0.4, 0]} rotation={[0, 0, -0.14]}>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
        </mesh>
        {/* gauntlets with spikes */}
        <mesh material={armorDark} position={[-0.72, -0.02, 0.02]}>
          <boxGeometry args={[0.34, 0.52, 0.36]} />
        </mesh>
        <mesh material={armorDark} position={[0.72, -0.02, 0.02]}>
          <boxGeometry args={[0.34, 0.52, 0.36]} />
        </mesh>
        <mesh material={steel} position={[-0.72, 0.26, 0.02]}>
          <coneGeometry args={[0.035, 0.16, 10]} />
        </mesh>
        <mesh material={steel} position={[0.72, 0.26, 0.02]}>
          <coneGeometry args={[0.035, 0.16, 10]} />
        </mesh>
        <mesh material={steel} position={[-0.72, 0.12, 0.02]}>
          <coneGeometry args={[0.035, 0.16, 10]} />
        </mesh>
        <mesh material={steel} position={[0.72, 0.12, 0.02]}>
          <coneGeometry args={[0.035, 0.16, 10]} />
        </mesh>
        {/* fists */}
        <mesh material={armor} position={[-0.72, -0.3, 0.02]}>
          <boxGeometry args={[0.3, 0.28, 0.3]} />
        </mesh>
        <mesh material={armor} position={[0.72, -0.3, 0.02]}>
          <boxGeometry args={[0.3, 0.28, 0.3]} />
        </mesh>

        {/* cowl + head */}
        <group ref={headRef} position={[0, 1.42, 0]}>
          <mesh material={armorDark}>
            <sphereGeometry args={[0.33, 32, 24]} />
          </mesh>
          <mesh material={armor} position={[0, -0.22, 0.06]}>
            <boxGeometry args={[0.3, 0.24, 0.34]} />
          </mesh>
          <mesh material={armor} position={[-0.13, 0.36, -0.04]} rotation={[0, 0, -0.32]}>
            <coneGeometry args={[0.09, 0.42, 14]} />
          </mesh>
          <mesh material={armor} position={[0.13, 0.36, -0.04]} rotation={[0, 0, 0.32]}>
            <coneGeometry args={[0.09, 0.42, 14]} />
          </mesh>
          <mesh material={eyeMat} position={[-0.1, 0.04, 0.29]}>
            <boxGeometry args={[0.1, 0.045, 0.02]} />
          </mesh>
          <mesh material={eyeMat} position={[0.1, 0.04, 0.29]}>
            <boxGeometry args={[0.1, 0.045, 0.02]} />
          </mesh>
        </group>

        {/* cape */}
        <group ref={capeRef} position={[0, 0.95, -0.5]} rotation={[0.06, 0, 0]}>
          <mesh ref={capeMeshRef} geometry={capeGeo} material={capeMat} castShadow />
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Particle galaxy with mouse parallax                                  */
/* ------------------------------------------------------------------ */
function ParticleGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

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
          blending={THREE.AdditiveBlending}
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
              vec3 gold = vec3(1.0, 0.847, 0.302);
              vec3 steel = vec3(0.29, 0.34, 0.42);
              vec3 col = mix(gold, steel, 0.38 + vPulse * 2.0);
              gl_FragColor = vec4(col, alpha * 0.9);
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
            color={i % 3 === 0 ? "#ffd84d" : "#8a9bb0"}
            transparent
            opacity={0.14}
          />
        </line>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Radar / pipeline rings                                               */
/* ------------------------------------------------------------------ */
function PipelineRings() {
  const groupRef = useRef<THREE.Group>(null);

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
            color={i % 2 === 0 ? "#ffd84d" : "#6d7888"}
            transparent
            opacity={i === 1 ? 0.3 : 0.16}
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

function GothamRain() {
  const linesRef = useRef<THREE.LineSegments>(null);

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
      <lineBasicMaterial color="#3d4f68" transparent opacity={0.34} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* ------------------------------------------------------------------ */
/* Bat-signal: beam cast down from the sky onto the figure              */
/* ------------------------------------------------------------------ */
function BatSignalBeam() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.16;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.07 + Math.sin(t * 0.8) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, 3.2, -3]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[4.2, 10, 32, 1, true]} />
      <meshBasicMaterial color="#ffd84d" transparent opacity={0.07} side={THREE.BackSide} depthWrite={false} />
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
