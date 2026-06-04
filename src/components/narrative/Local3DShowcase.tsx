"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Floating dust particles
function DustParticles() {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 4,
      speed: Math.random() * 0.1 + 0.03,
      wobble: Math.random() * 0.3 + 0.1,
      wobbleSpeed: Math.random() * 1.0 + 0.3,
      seed: Math.random() * 100,
      scale: Math.random() * 0.012 + 0.003,
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const safeDelta = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    particles.forEach((p, idx) => {
      p.y += p.speed * safeDelta;
      const currentX = p.x + Math.sin(time * p.wobbleSpeed + p.seed) * p.wobble * 0.08;
      
      if (p.y > 2.0) {
        p.y = -2.0;
        p.x = (Math.random() - 0.5) * 6;
      }

      tempObject.position.set(currentX, p.y, p.z);
      tempObject.scale.setScalar(p.scale);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(idx, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#E8A84A" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

// Floating Glass Preview Screen
function FloatingScreen({ activeTab }: { activeTab: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // High-quality project images matching the index URLs
  const urls = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
  ];
  
  const textures = useTexture(urls);
  const opacities = useRef([1, 0, 0, 0]);
  const materials = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    // Elegant swaying floating motion
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.08 + 0.1;
      groupRef.current.position.x = -0.5 + Math.cos(time * 0.3) * 0.03;
      groupRef.current.rotation.y = -0.22 + Math.sin(time * 0.2) * 0.02;
    }

    // Cross-fade opacity interpolation
    for (let i = 0; i < 4; i++) {
      const target = activeTab === i ? 1.0 : 0.0;
      opacities.current[i] = THREE.MathUtils.lerp(opacities.current[i], target, safeDelta * 3.5);
      
      if (materials.current[i]) {
        materials.current[i].opacity = opacities.current[i];
        materials.current[i].visible = opacities.current[i] > 0.01;
      }
    }
  });

  return (
    <group ref={groupRef} position={[-0.5, 0.1, -0.4]} rotation={[0.02, -0.22, 0.01]}>
      {/* Cinematic Glass Backing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.0, 0.04]} />
        <meshPhysicalMaterial 
          color="#121218" 
          roughness={0.1} 
          metalness={0.1}
          transmission={0.7}
          thickness={1.0}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Thin Gold Bezel Ring */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[3.22, 2.02, 0.01]} />
        <meshStandardMaterial 
          color="#E8A84A" 
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Screen Textures Stack */}
      {textures.map((tex, idx) => (
        <mesh key={idx} position={[0, 0, 0.022 + idx * 0.001]}>
          <planeGeometry args={[3.1, 1.9]} />
          <meshStandardMaterial
            ref={(el) => {
              if (el) materials.current[idx] = el as THREE.MeshStandardMaterial;
            }}
            map={tex}
            transparent
            opacity={idx === 0 ? 1 : 0}
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Sculpture I: Campusly (Structural Celestial Gyroscope)
function StructureSculpture({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const scaleRef = useRef(active ? 1 : 0.001);
  const opacityRef = useRef(active ? 1 : 0);
  const posYRef = useRef(active ? 0.25 : -1.5);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    const targetScale = active ? 1.0 : 0.001;
    const targetOpacity = active ? 1.0 : 0.0;
    const targetPosY = active ? 0.25 : -1.5;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, safeDelta * 4.0);
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, safeDelta * 4.0);
    posYRef.current = THREE.MathUtils.lerp(posYRef.current, targetPosY, safeDelta * 4.0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
      groupRef.current.position.y = posYRef.current + Math.sin(time * 1.0) * 0.05;
      groupRef.current.rotation.y += safeDelta * 0.12;

      // Update material opacities recursively
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.transparent = true;
            mat.opacity = opacityRef.current;
          }
        }
      });
    }

    if (coreRef.current && active) {
      coreRef.current.rotation.x -= safeDelta * 0.25;
      coreRef.current.rotation.y += safeDelta * 0.4;
    }
    if (ring1Ref.current && active) {
      ring1Ref.current.rotation.x += safeDelta * 0.5;
    }
    if (ring2Ref.current && active) {
      ring2Ref.current.rotation.z -= safeDelta * 0.7;
    }
  });

  return (
    <group ref={groupRef} position={[1.3, 0.25, 0.2]}>
      {/* Central Solid Brass Octahedron */}
      <mesh ref={coreRef} castShadow>
        <octahedronGeometry args={[0.32]} />
        <meshStandardMaterial 
          color="#E8A84A" 
          roughness={0.2} 
          metalness={0.95} 
        />
      </mesh>

      {/* Wireframe Nested Box Frame */}
      <mesh ref={ring1Ref}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <meshStandardMaterial 
          color="#E8A84A" 
          wireframe
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Wireframe Nested Octahedron Frame */}
      <mesh ref={ring2Ref}>
        <octahedronGeometry args={[0.65]} />
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Sculpture II: RetroRift (The Split Monolith revealing glowing light)
function MonolithSculpture({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftColRef = useRef<THREE.Mesh>(null);
  const rightColRef = useRef<THREE.Mesh>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);

  const scaleRef = useRef(active ? 1 : 0.001);
  const opacityRef = useRef(active ? 1 : 0);
  const posYRef = useRef(active ? 0.25 : -1.5);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    const targetScale = active ? 1.0 : 0.001;
    const targetOpacity = active ? 1.0 : 0.0;
    const targetPosY = active ? 0.25 : -1.5;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, safeDelta * 4.0);
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, safeDelta * 4.0);
    posYRef.current = THREE.MathUtils.lerp(posYRef.current, targetPosY, safeDelta * 4.0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
      groupRef.current.position.y = posYRef.current + Math.sin(time * 0.85) * 0.05;
      groupRef.current.rotation.y += safeDelta * 0.18;

      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.transparent = true;
            mat.opacity = opacityRef.current;
          }
        }
      });
    }

    // Slide monolith halves apart
    const separation = active ? (0.18 + Math.sin(time * 0.8) * 0.08) : 0.05;
    
    if (leftColRef.current) {
      leftColRef.current.position.x = -separation;
    }
    if (rightColRef.current) {
      rightColRef.current.position.x = separation;
    }

    if (coreLightRef.current) {
      coreLightRef.current.intensity = active ? (3.0 + Math.sin(time * 3.0) * 1.0) : 0;
    }
  });

  return (
    <group ref={groupRef} position={[1.3, 0.25, 0.2]}>
      {/* Left Monolith Half */}
      <mesh ref={leftColRef} position={[-0.18, 0, 0]} castShadow>
        <boxGeometry args={[0.25, 1.1, 0.25]} />
        <meshStandardMaterial 
          color="#16161a" 
          roughness={0.15} 
          metalness={0.9} 
        />
      </mesh>

      {/* Right Monolith Half */}
      <mesh ref={rightColRef} position={[0.18, 0, 0]} castShadow>
        <boxGeometry args={[0.25, 1.1, 0.25]} />
        <meshStandardMaterial 
          color="#16161a" 
          roughness={0.15} 
          metalness={0.9} 
        />
      </mesh>

      {/* Internal Neon Core Tube */}
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.0, 16]} />
        <meshStandardMaterial 
          color="#a855f7" 
          emissive="#a855f7"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <pointLight ref={coreLightRef} position={[0, 0, 0]} intensity={0} color="#a855f7" distance={4} />
    </group>
  );
}

// Sculpture III: SNIPCAST (Refractive Floating Glass Plates)
function GlassPlatesSculpture({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const plate1Ref = useRef<THREE.Mesh>(null);
  const plate2Ref = useRef<THREE.Mesh>(null);
  const plate3Ref = useRef<THREE.Mesh>(null);

  const scaleRef = useRef(active ? 1 : 0.001);
  const opacityRef = useRef(active ? 1 : 0);
  const posYRef = useRef(active ? 0.25 : -1.5);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    const targetScale = active ? 1.0 : 0.001;
    const targetOpacity = active ? 1.0 : 0.0;
    const targetPosY = active ? 0.25 : -1.5;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, safeDelta * 4.0);
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, safeDelta * 4.0);
    posYRef.current = THREE.MathUtils.lerp(posYRef.current, targetPosY, safeDelta * 4.0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
      groupRef.current.position.y = posYRef.current + Math.sin(time * 1.15) * 0.05;
      groupRef.current.rotation.y += safeDelta * 0.15;

      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshPhysicalMaterial;
            mat.transparent = true;
            mat.opacity = opacityRef.current * 0.8; // Max opacity 0.8 for transparency look
          }
        }
      });
    }

    if (plate1Ref.current && active) {
      plate1Ref.current.position.z = Math.sin(time * 0.9) * 0.15;
      plate1Ref.current.rotation.x = Math.sin(time * 0.4) * 0.05;
    }
    if (plate2Ref.current && active) {
      plate2Ref.current.position.z = Math.cos(time * 1.1) * 0.12;
      plate2Ref.current.rotation.y = Math.cos(time * 0.3) * 0.05;
    }
    if (plate3Ref.current && active) {
      plate3Ref.current.position.z = -Math.sin(time * 0.9) * 0.15;
      plate3Ref.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[1.3, 0.25, 0.2]}>
      {/* Glass Plate 1 */}
      <mesh ref={plate1Ref} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.0, 0.18, 0.22]} />
        <meshPhysicalMaterial 
          color="#3b82f6" 
          roughness={0.05} 
          metalness={0.2}
          transmission={0.85}
          thickness={1.0}
        />
      </mesh>

      {/* Glass Plate 2 */}
      <mesh ref={plate2Ref} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 0.18, 0.22]} />
        <meshPhysicalMaterial 
          color="#60a5fa" 
          roughness={0.05} 
          metalness={0.2}
          transmission={0.85}
          thickness={1.0}
        />
      </mesh>

      {/* Glass Plate 3 */}
      <mesh ref={plate3Ref} position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.0, 0.18, 0.22]} />
        <meshPhysicalMaterial 
          color="#2563eb" 
          roughness={0.05} 
          metalness={0.2}
          transmission={0.85}
          thickness={1.0}
        />
      </mesh>
    </group>
  );
}

// Sculpture IV: HEIC Studio (The Morphing Geodesic Core)
function GeodesicMorphSculpture({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const scaleRef = useRef(active ? 1 : 0.001);
  const opacityRef = useRef(active ? 1 : 0);
  const posYRef = useRef(active ? 0.25 : -1.5);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    const targetScale = active ? 1.0 : 0.001;
    const targetOpacity = active ? 1.0 : 0.0;
    const targetPosY = active ? 0.25 : -1.5;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, safeDelta * 4.0);
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, safeDelta * 4.0);
    posYRef.current = THREE.MathUtils.lerp(posYRef.current, targetPosY, safeDelta * 4.0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
      groupRef.current.position.y = posYRef.current + Math.sin(time * 0.9) * 0.05;
      groupRef.current.rotation.y += safeDelta * 0.2;
      groupRef.current.rotation.x += safeDelta * 0.08;

      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.transparent = true;
            mat.opacity = opacityRef.current;
          }
        }
      });
    }

    if (meshRef.current && active) {
      const morphFactor = 0.72 + Math.sin(time * 1.8) * 0.07;
      meshRef.current.scale.set(morphFactor, morphFactor, morphFactor);
    }
  });

  return (
    <group ref={groupRef} position={[1.3, 0.25, 0.2]}>
      {/* Geodesic Core */}
      <mesh ref={meshRef} castShadow>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial 
          color="#f43f5e" 
          wireframe
          emissive="#e11d48"
          emissiveIntensity={1.0}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
      
      {/* Inner Solid Core Sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color="#fda4af" 
          roughness={0.1}
          metalness={0.95}
        />
      </mesh>
    </group>
  );
}

// Light Controller for color transition
function ShiftingLights({ activeTab }: { activeTab: number }) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const colors = ["#E8A84A", "#a855f7", "#3b82f6", "#f43f5e"];
  const targetColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    targetColor.set(colors[activeTab]);

    if (spotLightRef.current) {
      spotLightRef.current.color.lerp(targetColor, safeDelta * 2.5);
    }
    if (pointLightRef.current) {
      pointLightRef.current.color.lerp(targetColor, safeDelta * 2.5);
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      
      {/* Direct Volumetric Spotlight */}
      <spotLight 
        ref={spotLightRef}
        position={[0, 6, 2]} 
        intensity={6.0} 
        angle={0.5} 
        penumbra={0.9} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Accent spotlight directed at the kinetic sculpture */}
      <pointLight 
        ref={pointLightRef}
        position={[1.3, 0.25, 0.5]} 
        intensity={3.0} 
        distance={5} 
      />

      {/* Subtle side cyan fill light to preserve glass refraction depth */}
      <directionalLight position={[-4, 2, 3]} intensity={0.25} color="#5b8fb9" />
    </>
  );
}

interface Local3DShowcaseProps {
  activeTab: number;
}

export default function Local3DShowcase({ activeTab }: Local3DShowcaseProps) {
  return (
    <div className="w-full h-full min-h-[350px] lg:min-h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0.15, 4.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="w-full h-full"
        shadows
      >
        <ShiftingLights activeTab={activeTab} />

        <React.Suspense fallback={null}>
          <FloatingScreen activeTab={activeTab} />
          <DustParticles />
          
          <StructureSculpture active={activeTab === 0} />
          <MonolithSculpture active={activeTab === 1} />
          <GlassPlatesSculpture active={activeTab === 2} />
          <GeodesicMorphSculpture active={activeTab === 3} />
        </React.Suspense>

        <OrbitControls 
          enableZoom={false} 
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.95}
          minPolarAngle={Math.PI / 2.25}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}

