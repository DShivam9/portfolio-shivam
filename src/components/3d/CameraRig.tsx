"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    // Subtle mouse parallax effect instead of scrolling away
    const targetX = pointer.x * 0.5;
    const targetY = pointer.y * 0.5;

    // Smooth damp the camera to the target
    const damping = 2.0;
    const safeDelta = Math.min(delta * damping, 0.1);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, safeDelta);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, safeDelta);
  });

  return null;
}
