"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";

export default function PhoenixModel() {
  const { scene, animations } = useGLTF("/models/phoenix_bird/scene.gltf");
  const { actions } = useAnimations(animations, scene);
  const birdMesh = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const maxProgressRef = useRef(0);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      const action = actions[actionName];
      if (action) {
        action.play();
        action.setEffectiveTimeScale(0.4); // majestic slow flap
      }
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!group.current || !birdMesh.current) return;
    
    // Read Scroll Progress from Zustand
    // 0 = top of page, 1 = scrolled past hero section
    const progress = useScrollStore.getState().progress.hero;
    maxProgressRef.current = Math.max(maxProgressRef.current, progress);
    
    const safeDelta = Math.min(delta, 0.1);

    const centerOffsetX = -0.15; // Offset slightly left to center the bird exactly between 'f' and 't'

    // BIRD ANIMATION LOGIC:
    // Starts directly at the bottom (center x)
    const startX = centerOffsetX; 
    const startY = -20; // Bottom off-screen
    const startZ = -20; // Pushed back for depth

    // Stops in the exact center of the screen
    const endX = centerOffsetX; 
    const endY = 1.5; // Moved up vertically so the tail isn't cut off by the bottom of the screen
    const endZ = -0.5; // Moved further forward to make it fully visible

    // Lerp position based on scroll progress (one-way only so it doesn't reverse)
    const arriveProgress = Math.min(1.0, maxProgressRef.current * 2.0); // 0 to 1 as we scroll to 0.5
    const easedArrival = arriveProgress * (2 - arriveProgress);

    let targetX = startX + (endX - startX) * easedArrival;
    let targetY = startY + (endY - startY) * easedArrival;
    let targetZ = startZ + (endZ - startZ) * easedArrival;

    // DOM TRACKING & FLIGHT LAUNCH: Make bird fly up and off-screen as the Hero section unpins and scrolls away
    const anchor = document.getElementById("bird-anchor");
    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const screenCenterY = window.innerHeight / 2;
      
      // If the hero section is scrolling up off the screen, move the bird with it
      if (centerY < screenCenterY) {
        const pixelDiff = screenCenterY - centerY;
        // Convert pixels to 3D units
        const distance = 10 - targetZ; // camera Z is 10
        const vFov = (45 * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
        const unitsPerPixel = visibleHeight / window.innerHeight;
        
        // Base scroll tracking position
        targetY += pixelDiff * unitsPerPixel;

        // Exponential flight takeoff boost (cubic progression)
        // Launches bird straight up off the top of the viewport
        const launchProgress = Math.min(1.0, pixelDiff / (window.innerHeight * 0.6)); // Complete takeoff within 60% of viewport scroll
        const flyUpOffset = Math.pow(launchProgress, 2.0) * 18.0; // Dynamic upward surge
        targetY += flyUpOffset;
      }
    }

    // Scale stays at a majestic 1.0 (no scaling down)
    const targetScale = new THREE.Vector3(1, 1, 1);
    group.current.scale.lerp(targetScale, safeDelta * 4.0);

    // Apply Position smoothly EXACTLY ONCE
    const finalTargetPos = new THREE.Vector3(targetX, targetY, targetZ);
    group.current.position.lerp(finalTargetPos, safeDelta * 4.0);
  });

  return (
    <group ref={group} position={[-0.15, -20, -20]}>
      {/* 
        This wrapper group spins the bird 180 degrees around the global Y-axis 
        so its belly faces the background and its back faces the camera. 
      */}
      <group rotation={[0, Math.PI, 0]}>
        {/* This original rotation ensures the head points perfectly UP towards the navbar */}
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
