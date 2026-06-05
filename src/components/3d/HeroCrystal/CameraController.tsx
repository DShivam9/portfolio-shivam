import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSkillReveal } from './store';
import gsap from 'gsap';

export default function CameraController() {
  const { camera } = useThree();
  const status = useSkillReveal((state) => state.status);
  
  useEffect(() => {
    // The Cinematic Push: 
    // When selected, fly the camera forward to examine, but leave enough space so it doesn't get cut off vertically
    // When idle, pull back to observe the monolith
    const targetZ = status === 'selected' ? 7.5 : 12;
    
    gsap.to(camera.position, {
      z: targetZ,
      duration: 2.5,
      ease: "power3.inOut"
    });
  }, [status, camera]);
  
  useFrame((state) => {
    // Subtle parallax that makes the 3D space feel alive to mouse movements
    const targetX = (state.pointer.x * 2);
    const targetY = (state.pointer.y * 2);
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}
