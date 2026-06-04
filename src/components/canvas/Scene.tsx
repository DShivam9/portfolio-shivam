"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { Suspense } from "react";
import * as THREE from "three";
import { ToneMappingMode } from "postprocessing";



// --- DOWNWARD FLOWING EMBER TRAIL ---
const EMBER_COUNT = 200;

function MagicalEmbers({ birdRef }: { birdRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: EMBER_COUNT }, () => ({
      position: new THREE.Vector3(0, -1000, 0),
      velocity: new THREE.Vector3(),
      life: 0,
      maxLife: Math.random() * 2 + 1.0, 
      scale: Math.random() * 0.08 + 0.02
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current || !birdRef.current) return;

    const safeDelta = Math.min(delta, 0.1);

    for (let i = 0; i < 2; i++) {
      const deadParticle = particles.find(p => p.life <= 0);
      if (deadParticle) {
        const birdPos = new THREE.Vector3();
        birdRef.current.getWorldPosition(birdPos);
        
        // Spawn slightly below the bird
        deadParticle.position.copy(birdPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 3.0,
          (Math.random() - 0.5) * 1.5 - 1.0,
          (Math.random() - 0.5) * 3.0
        ));
        
        // Embers flow DOWNWARDS because bird is flying UP
        deadParticle.velocity.set(
          (Math.random() - 0.5) * 1.5,
          -(Math.random() * 2.0 + 1.0), 
          (Math.random() - 0.5) * 1.5
        );
        deadParticle.life = deadParticle.maxLife;
      }
    }

    particles.forEach((p, i) => {
      if (p.life > 0) {
        p.life -= safeDelta;
        p.position.addScaledVector(p.velocity, safeDelta);
        
        dummy.position.copy(p.position);
        
        const progress = p.life / p.maxLife;
        const scale = p.scale * Math.pow(progress, 0.5); 
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(0, -1000, 0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, EMBER_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffaa00" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

// --- RISING PHOENIX LOGIC ---
function Phoenix() {
  const { scene, animations } = useGLTF("/models/phoenix_bird/scene.gltf");
  const { actions } = useAnimations(animations, scene);
  const birdMesh = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  
  // Physics State: Start deep below the screen
  const currentPos = useRef(new THREE.Vector3(0, -30, -15));

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      const action = actions[actionName];
      if (action) {
        action.play();
        action.setEffectiveTimeScale(0.35); 
      }
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!group.current || !birdMesh.current) return;
    
    const safeDelta = Math.min(delta, 0.1);

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    
    // 1. VERTICAL RISE & EXACT HERO ANCHOR LOGIC
    // The Prologue section is 500vh tall and uses a sticky container.
    // This means the text STAYS in the center of the screen for the first 500vh of scrolling.
    const visibleHeightAtZ = 2 * Math.tan((45 / 2) * (Math.PI / 180)) * 25; // ~20.7 units
    
    const riseEndScroll = vh; // Take a full 100vh to smoothly rise to the center
    const stickyEndScroll = vh * 4; // 500vh section - 100vh sticky child = 400vh of sticky scrolling
    
    let targetX = 0;
    let targetY = 0;
    
    if (scrollY <= riseEndScroll) {
      // Phase 1: Rise from the bottom to the center smoothly
      const progress = scrollY / riseEndScroll; // 0 to 1
      targetY = THREE.MathUtils.lerp(-30, 0, progress);
    } else {
      // Phase 2: Lock perfectly in the center for the rest of the page
      targetY = 0;
    }

    const targetPos = new THREE.Vector3(targetX, targetY, -15);
    
    // 2. Micro-Motion Drift (Breathing)
    // Constantly floats slightly even when locked in the center
    const driftX = Math.sin(state.clock.elapsedTime * 0.4) * 0.8;
    const driftY = Math.cos(state.clock.elapsedTime * 0.5) * 0.5;
    targetPos.x += driftX;
    targetPos.y += driftY;

    // Apply Position with smooth inertia
    currentPos.current.lerp(targetPos, safeDelta * 3.0);
    group.current.position.copy(currentPos.current);
    
    // 3. LOOKING UPWARDS ROTATION
    // Face forward but tilt nose upwards heavily
    const forwardRotation = Math.PI / 1.6; 
    const upwardTilt = Math.PI / 4; // Positive value tilts nose UP
    
    birdMesh.current.rotation.set(upwardTilt, forwardRotation, 0);
  });

  return (
    <group ref={group}>
      <group ref={birdMesh}>
        <primitive object={scene} scale={0.015} />
      </group>
      <MagicalEmbers birdRef={group} />
    </group>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <fogExp2 attach="fog" args={["#070709", 0.02]} />
        
        <ambientLight intensity={0.4} color="#1a103c" />
        <directionalLight position={[20, 15, 10]} intensity={3.5} color="#ffb84d" />
        <directionalLight position={[-20, 10, -20]} intensity={5} color="#ffffff" />



        <Suspense fallback={null}>
          <Phoenix />
        </Suspense>

        <EffectComposer>
          <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.8} radius={0.6} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/phoenix_bird/scene.gltf");
