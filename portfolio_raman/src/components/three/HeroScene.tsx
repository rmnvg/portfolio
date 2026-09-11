"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Node({
  radius,
  speed,
  tilt,
  offset,
  size,
  color,
}: {
  radius: number;
  speed: number;
  tilt: number;
  offset: number;
  size: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t) * radius * Math.sin(tilt),
        Math.sin(t) * radius * Math.cos(tilt),
      );
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        toneMapped={false}
      />
    </mesh>
  );
}

function OrbitNodes() {
  const nodes = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        radius: 2 + (i % 3) * 0.35,
        speed: 0.25 + (i % 4) * 0.12,
        tilt: (i / 10) * Math.PI,
        offset: i * 1.3,
        size: 0.035 + (i % 3) * 0.012,
        color: i % 2 === 0 ? "#e4703a" : "#5fb49c",
      })),
    [],
  );

  return (
    <>
      {nodes.map((n, i) => (
        <Node key={i} {...n} />
      ))}
    </>
  );
}

function Core() {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.18;
      coreRef.current.rotation.x += delta * 0.06;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.1;
      wireRef.current.rotation.z += delta * 0.04;
    }
    if (groupRef.current) {
      const { x, y } = state.pointer;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        x * 0.35,
        0.04,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -y * 0.25,
        0.04,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.3, 6]} />
          <MeshDistortMaterial
            color="#8c3d1c"
            emissive="#e4703a"
            emissiveIntensity={0.35}
            distort={0.42}
            speed={1.8}
            roughness={0.2}
            metalness={0.75}
          />
        </mesh>
        <mesh ref={wireRef} scale={1.22}>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial
            color="#5fb49c"
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>
      </Float>
      <OrbitNodes />
      <Sparkles count={60} scale={4.2} size={1.6} speed={0.25} color="#e4703a" />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      className="!touch-none"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#e4703a" />
      <pointLight position={[-4, -2, -3]} intensity={20} color="#5fb49c" />
      <Core />
    </Canvas>
  );
}
