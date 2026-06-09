"use client";

import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, Center, Float, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function MascotModel({ 
  path = "/models/ally_mc/scene.gltf", 
  scale = 1,
  active = false
}: { 
  path?: string; 
  scale?: number;
  active?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play the first animation found (usually idle/fly)
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      const action = actions[actionName];
      if (action) {
        action.reset().fadeIn(0.5).play();
        if (active) {
          action.setEffectiveTimeScale(1.5); // speed up when clicked
        } else {
          action.setEffectiveTimeScale(1.0);
        }
      }
    }
  }, [actions, active]);

  // Make the mascot look at the mouse
  useFrame((state) => {
    if (group.current && !active) {
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      
      // Smoothly interpolate rotation towards mouse
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.05);
    } else if (group.current && active) {
      // When active (clicked), spin around and fly up!
      group.current.rotation.y += 0.1;
      group.current.position.y += 0.05;
    }
  });

  return (
    <Float 
      speed={active ? 5 : 2} 
      rotationIntensity={active ? 2 : 0.5} 
      floatIntensity={active ? 2 : 0.5} 
      floatingRange={[-0.2, 0.2]}
    >
      <group ref={group}>
        <Bounds fit clip observe margin={1.2}>
          <Center>
            <primitive object={scene} />
          </Center>
        </Bounds>
      </group>
    </Float>
  );
}

// Preload the default mascot
useGLTF.preload("/models/ally_mc/scene.gltf");
