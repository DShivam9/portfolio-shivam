/*
"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

function AnimatedModel({ path, scale = 1, rotation = [0, 0, 0], float = true }: { path: string; scale?: number; rotation?: [number, number, number]; float?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      firstAction?.play();
    }
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    if (float) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    }
    group.current.rotation.y += 0.005;
  });

  return (
    <group ref={group} rotation={new THREE.Euler(...rotation)}>
      <Center>
        <primitive object={scene} scale={scale} />
      </Center>
    </group>
  );
}

export function MinecraftFox() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 35 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
      <Bounds fit clip observe margin={1.2}>
        <AnimatedModel path="/models/minecraft_fox/scene.gltf" scale={1} float={true} rotation={[0, -0.5, 0]} />
      </Bounds>
    </Canvas>
  );
}

export function MinecraftCat() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 35 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
      <Bounds fit clip observe margin={1.2}>
        <AnimatedModel path="/models/minecraft_cat/scene.gltf" scale={1} float={true} rotation={[0, 0.5, 0]} />
      </Bounds>
    </Canvas>
  );
}

export function MinecraftAxolotl() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 35 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
      <Bounds fit clip observe margin={1.2}>
        <AnimatedModel path="/models/minecraft_axolotl/scene.gltf" scale={1} float={true} rotation={[0.2, -0.4, 0]} />
      </Bounds>
    </Canvas>
  );
}

useGLTF.preload("/models/minecraft_fox/scene.gltf");
useGLTF.preload("/models/minecraft_cat/scene.gltf");
useGLTF.preload("/models/minecraft_axolotl/scene.gltf");
*/
