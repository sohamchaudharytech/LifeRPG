"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function RotatingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.2;
      wireRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group>
      {/* Outer Wireframe Cage */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color="#06B6D4" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Inner Glowing Crystal */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#6D28D9"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export function Hero3DCore() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Fallback CSS Graphic if WebGL is unavailable
  if (hasWebGL === false) {
    return (
      <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/30 to-cyan-500/30 blur-2xl animate-pulse-glow" />
        <div className="relative w-48 h-48 rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-1 shadow-[0_0_50px_rgba(6,182,212,0.5)] rotate-45 animate-float">
          <div className="w-full h-full bg-surface-elevated rounded-3xl flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-500 shadow-inner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-96 flex items-center justify-center">
      {/* Background ambient glow behind canvas */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-600/25 to-pink-500/15 blur-3xl pointer-events-none" />
      {hasWebGL && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#22D3EE" />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#A855F7" />
          <RotatingCore />
        </Canvas>
      )}
    </div>
  );
}
