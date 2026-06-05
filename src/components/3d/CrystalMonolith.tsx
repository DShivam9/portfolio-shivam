"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

interface CrystalMonolithProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  runeText?: string;
  seed?: number;
}

export default function CrystalMonolith({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, runeText = "!!", seed = 1 }: CrystalMonolithProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 1. Procedural Geometry Generation
  // To match the cinematic reference: One single, chunky, organic glass rock.
  const { geometries } = useMemo(() => {
    // Icosahedron with detail=1 or 2 gives a nice irregular mesh
    const baseGeo = new THREE.IcosahedronGeometry(1.5, 1);
    
    // Displace vertices to make it look like a natural, jagged rock instead of a perfect sphere
    const posAttribute = baseGeo.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      // Add seeded random noise based on vertex position
      const noise = Math.sin(vertex.x * 3 + seed) * Math.cos(vertex.y * 3 + seed) * Math.sin(vertex.z * 3 + seed);
      // Push vertices outward/inward organically
      vertex.addScalar(noise * 0.3);
      
      // Flatten it slightly on the Z axis to make it more of a slab
      vertex.z *= 0.7;
      
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    baseGeo.computeVertexNormals();
    return { geometries: baseGeo };
  }, [seed]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle, majestic rotation
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.z += delta * 0.05;
      
      // Gentle hovering effect
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y += Math.sin(time * 0.5 + seed) * 0.002;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      
      {/* RENDER THE SINGLE MASSIVE ROCK */}
      <group>
        {/* LAYER A: The Outer Shell (Highly Refractive Glass) */}
        <mesh geometry={geometries} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#ffffff"
            transparent={true}
            opacity={0.3}
            roughness={0.0}
            metalness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* RUNE TEXT (Floating inside the glass core) */}
      <Text
        position={[0, 0, 0]}
        fontSize={1.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {runeText}
        <meshBasicMaterial toneMapped={false} color={[3, 3, 3]} />
      </Text>
    </group>
  );
}
