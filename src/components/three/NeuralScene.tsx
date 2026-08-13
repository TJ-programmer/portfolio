"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, Stars } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function NeuralScene() {
  return (
    <div className="scene-shell" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 54 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#030405"]} />
        <fog attach="fog" args={["#030405", 8, 22]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 6, 4]} color="#ffd84d" intensity={60} />
        <pointLight position={[-5, -4, 5]} color="#4a5568" intensity={18} />
        <pointLight position={[5, 2, 3]} color="#ffd84d" intensity={20} />
        <CameraPath />
        <Stars radius={90} depth={50} count={1200} factor={3} fade speed={0.3} />
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
          <NeuralParticles />
          <PipelineRings />
        </Float>
        <RainParticles />
        <BatSignalBeam />
      </Canvas>
    </div>
  );
}

function CameraPath() {
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

    tl.to(camera.position, { x: 1.6, y: -0.5, z: 6.6, ease: "none" })
      .to(camera.position, { x: -1.4, y: 0.6, z: 7.2, ease: "none" })
      .to(camera.position, { x: 0.4, y: -0.2, z: 7.8, ease: "none" })
      .to(camera.position, { x: 0, y: 0, z: 8.4, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [camera]);

  useFrame(() => camera.lookAt(0, 0, 0));
  return null;
}

function NeuralParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const { positions, connections } = useMemo(() => {
    const count = 480;
    const pts = new Float32Array(count * 3);
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 2.0 + Math.sin(i * 0.37) * 0.6 + Math.random() * 0.4;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.7;
      const z = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3] = x;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = z;
      if (i % 24 === 0) nodes.push(new THREE.Vector3(x, y, z));
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
      pointsRef.current.rotation.y = clock.elapsedTime * 0.07 + mouse.current.x * 0.18;
      pointsRef.current.rotation.x = mouse.current.y * 0.09;
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
              pos.x += uMouse.x * 0.1;
              pos.y += uMouse.y * 0.07;
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
        <Line
          key={`${a.x.toFixed(2)}-${i}`}
          points={[a, b]}
          color={i % 3 === 0 ? "#ffd84d" : i % 3 === 1 ? "#8a9bb0" : "#ffd84d"}
          lineWidth={0.6}
          transparent
          opacity={0.15}
        />
      ))}
    </group>
  );
}

function PipelineRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.elapsedTime * 0.04;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.22;
  });

  return (
    <group ref={groupRef}>
      {[2.8, 3.5, 4.15, 4.8].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.15, i * 0.28, 0]}>
          <torusGeometry args={[r, 0.005, 8, 160]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ffd84d" : "#6d7888"}
            transparent
            opacity={i === 1 ? 0.28 : 0.16}
          />
        </mesh>
      ))}
    </group>
  );
}

function RainParticles() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime * 0.9;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] -= 0.028;
      pos[i * 3] -= 0.006;
      if (pos[i * 3 + 1] < -7) {
        pos[i * 3 + 1] = 7;
        pos[i * 3] = (Math.random() - 0.5) * 22;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z = Math.sin(t * 0.05) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#4a6080"
        size={0.018}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BatSignalBeam() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.z = Math.sin(t * 0.22) * 0.18;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.06 + Math.sin(t * 0.8) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, -1, -3]} rotation={[0, 0, 0]}>
      <coneGeometry args={[3.5, 9, 32, 1, true]} />
      <meshBasicMaterial color="#ffd84d" transparent opacity={0.07} side={THREE.BackSide} />
    </mesh>
  );
}
