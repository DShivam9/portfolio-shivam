"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";

export default function ArcadeModel() {
  // Using the lighter final_fight_arcade model
  const { scene } = useGLTF("/models/final_fight_arcade/scene.gltf");
  const group = useRef<THREE.Group>(null);
  
  // Make the screen emissive to glow
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material && mesh.name.toLowerCase().includes("screen")) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color("#4A9EBF");
        mat.emissiveIntensity = 2;
      }
    }
  });

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log("Arcade Model bounding box size X Y Z:", size.x, size.y, size.z);
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    const safeDelta = Math.min(delta, 0.1);
    
    // Base position for chapter 4, first project (RetroRift)
    // Project index 0 is Text Right, Model Left. So X is negative.
    const targetX = -3.5; 
    const targetY = -24.8; 
    
    const targetPos = new THREE.Vector3(targetX, targetY, -12);
    
    // Subtle float
    const hoverY = Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
    targetPos.y += hoverY;

    // Apply Position
    group.current.position.lerp(targetPos, safeDelta * 3.0);
    
    // Rotation - slight angle
    const rotY = -Math.PI / 6 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    
    group.current.rotation.set(0, rotY, 0);

    // Read Scroll Progress from Zustand
    const relic1Progress = useScrollStore.getState().progress.relic1;

    // Push-in effect: When scrolling past the center (progress > 0.5)
    if (relic1Progress > 0.5) {
      const exitProgress = (relic1Progress - 0.5) * 2; // 0 to 1
      // Scale gets massive to simulate diving into the screen
      const scale = 2.5 + Math.pow(exitProgress, 3) * 30;
      group.current.scale.set(scale, scale, scale);
      
      // Move closer to camera on Z
      targetPos.z += exitProgress * 15;
      group.current.position.lerp(targetPos, safeDelta * 10.0);
    } else {
      group.current.scale.set(2.5, 2.5, 2.5);
    }
  });

  return (
    <group ref={group} position={[3, -24.8, -12]}>
      {/* Screen glow light */}
      <pointLight position={[-0.5, 1, 1]} intensity={2} color="#4A9EBF" distance={5} />
      <primitive object={scene} scale={2.5} />
    </group>
  );
}

useGLTF.preload("/models/final_fight_arcade/scene.gltf");
