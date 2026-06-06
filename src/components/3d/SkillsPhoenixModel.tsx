"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { useScrollStore } from "@/store/scrollStore";

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
        
        deadParticle.position.copy(birdPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 3.0,
          (Math.random() - 0.5) * 1.5 - 1.0,
          (Math.random() - 0.5) * 3.0
        ));
        
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
      <meshBasicMaterial color="#E8A84A" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

export default function SkillsPhoenixModel() {
  const { scene: originalScene, animations } = useGLTF("/models/phoenix_bird/scene.gltf");
  const scene = useMemo(() => SkeletonUtils.clone(originalScene), [originalScene]);
  const { actions } = useAnimations(animations, scene);
  const birdMesh = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      const action = actions[actionName];
      if (action) {
        action.play();
        action.setEffectiveTimeScale(0.4); // majestic slow flap again
      }
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!group.current || !birdMesh.current) return;
    
    // Read Scroll Progress from Zustand
    const progress = useScrollStore.getState().progress.skills;
    
    const safeDelta = Math.min(delta, 0.1);

    // Start safely off-screen: [45, -25]
    // End safely off-screen: [-55, 30]
    const startX = 45; 
    const startY = -25;
    const startZ = -20; 

    const endX = -55; 
    const endY = 30; 
    const endZ = -20; 

    // Directly use scroll progress (0 to 1 over the 4000px pinned scroll distance)
    const flyProgress = progress;
    
    // STRICT VISIBILITY: Completely hide the model if we are in Hero, About, or Projects.
    if (flyProgress > 0.001 && flyProgress < 0.999) {
      group.current.visible = true;
    } else {
      group.current.visible = false;
    }
    
    // Linear progression maps 1:1 to scroll wheel.
    // (We removed the quadratic ease-in, which was causing the bird to crawl invisibly slow during the first 4 scrolls)
    const easedProgress = flyProgress;

    const targetX = startX + (endX - startX) * easedProgress;
    const targetY = startY + (endY - startY) * easedProgress;
    const targetZ = startZ + (endZ - startZ) * easedProgress;

    // Apply Position smoothly
    const finalTargetPos = new THREE.Vector3(targetX, targetY, targetZ);
    group.current.position.lerp(finalTargetPos, safeDelta * 5.0);

    // Scale up the bird so it feels massively colossal in the background
    const targetScale = new THREE.Vector3(3.5, 3.5, 3.5);
    group.current.scale.lerp(targetScale, safeDelta * 4.0);
  });

  return (
    <group ref={group} position={[40, -22.5, -20]}>
      {/* 
        Rotate the outer group so:
        - Math.PI on Y: belly faces background, back faces user.
        - -1.05 on Z: Head rotates counter-clockwise to perfectly align with the top-left trajectory
      */}
      <group rotation={[0, Math.PI, -1.05]}>
        {/* Base rotation ensuring head points UP relative to parent */}
        <group ref={birdMesh} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
          <primitive 
            object={scene} 
            scale={0.0115} 
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/phoenix_bird/scene.gltf");
