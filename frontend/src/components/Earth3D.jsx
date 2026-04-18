import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Sphere, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

const Earth = ({ setHovered, clicked, setClicked }) => {
  const earthRef = useRef();

  // Parallax rotation based on mouse
  useFrame((state) => {
    if (!earthRef.current) return;
    const t = state.clock.getElapsedTime();
    // Base rotation
    earthRef.current.rotation.y = t * 0.1;

    // Parallax from mouse
    const targetX = (state.mouse.x * Math.PI) / 10;
    const targetY = (state.mouse.y * Math.PI) / 10;

    earthRef.current.rotation.y += (targetX - earthRef.current.rotation.y) * 0.1;
    earthRef.current.rotation.x += (-targetY - earthRef.current.rotation.x) * 0.1;
  });

  return (
    <group ref={earthRef}>
      {/* Low Poly Earth */}
      <Icosahedron
        args={[2, 2]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          setClicked(true);
          setTimeout(() => setClicked(false), 300);
        }}
      >
        <meshStandardMaterial
          color="#0B130D"
          emissive="#00ff88"
          emissiveIntensity={0.3}
          wireframe={true}
        />
      </Icosahedron>

      {/* Solid inner sphere to hide wireframe backfaces */}
      <Sphere args={[1.95, 32, 32]}>
        <meshBasicMaterial color="#0a0f0d" />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial color="#00ff88" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
};

const Satellite = () => {
  const satRef = useRef();
  const orbitRadius = 3.5;

  useFrame((state) => {
    if (!satRef.current) return;
    const t = state.clock.getElapsedTime() * 0.5;
    satRef.current.position.x = Math.cos(t) * orbitRadius;
    satRef.current.position.z = Math.sin(t) * orbitRadius;
    satRef.current.position.y = Math.sin(t * 2) * 0.5; // slight bobbing
    satRef.current.rotation.y = -t;
    satRef.current.rotation.x = Math.sin(t) * 0.2;
  });

  return (
    <group>
      {/* Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      <group ref={satRef}>
        {/* Main Body */}
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.8} />
        </mesh>
        {/* Solar Panels */}
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.2]} />
          <meshStandardMaterial color="#00ff88" />
        </mesh>
        <mesh position={[-0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.2]} />
          <meshStandardMaterial color="#00ff88" />
        </mesh>
      </group>
    </group>
  );
};

const SceneContainer = () => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Scale animation
      const targetScale = hovered ? 1.05 : 1;
      const currentScale = groupRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;

      // Add pulse on click
      if (clicked) {
        groupRef.current.scale.set(newScale * 1.1, newScale * 1.1, newScale * 1.1);
      } else {
        groupRef.current.scale.set(newScale, newScale, newScale);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Earth setHovered={setHovered} clicked={clicked} setClicked={setClicked} />
        <Satellite />
      </Float>
    </group>
  );
};

export default function Earth3D() {
  return (
    <div className="absolute inset-0 z-0" style={{ background: '#0a0f0d' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} color="#ffffff" />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} color="#00ff88" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00ff88" />

        <SceneContainer />

        <Sparkles count={150} scale={12} size={2} speed={0.2} opacity={0.5} color="#00ff88" />
      </Canvas>
    </div>
  );
}
