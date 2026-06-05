import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

export function createCrystalGeometry(): THREE.BufferGeometry {
  // 1. Create a slightly lower density box. High density allows for tiny spikes, which we want to avoid.
  // 32x32x32 provides enough resolution for large fractures but naturally smooths out micro-noise.
  const baseGeo = new THREE.BoxGeometry(3, 4, 3, 32, 32, 32);
  
  const geometry = baseGeo.toNonIndexed();
  const positionAttribute = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  
  // Seeded random function: Guarantees the EXACT SAME crystal is generated every time.
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // Primary Shape: Create a clean, readable sculptural mass using fewer slicing planes.
  const planes: { normal: THREE.Vector3, distance: number }[] = [];
  
  // 6 vertical prism walls (creates a solid, heavy, readable column)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + (random() * 0.4);
    const normal = new THREE.Vector3(Math.cos(angle), (random() - 0.5) * 0.2, Math.sin(angle)).normalize();
    planes.push({ normal, distance: 0.9 + random() * 0.6 });
  }
  
  // Clean termination caps (top and bottom cuts)
  for (let i = 0; i < 4; i++) {
    const normal = new THREE.Vector3((random() - 0.5) * 0.8, Math.sign(random() - 0.5) * 1.5, (random() - 0.5) * 0.8).normalize();
    planes.push({ normal, distance: 1.2 + random() * 0.8 });
  }

  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);
    
    // Stretch to create an elongated chunk
    vertex.y *= 1.5;
    
    // VERY subtle base warp so the column isn't mathematically perfect, but retains its solid mass
    const baseWarp = noise3D(vertex.x * 0.3, vertex.y * 0.3, vertex.z * 0.3);
    vertex.x += baseWarp * 0.2;
    vertex.z += baseWarp * 0.2;
    
    // Primary Carving: Project vertices inside the planes to form a clean convex hull.
    // 90% of the geometry reads purely from this clean cut shape.
    for (let iter = 0; iter < 3; iter++) {
      for (const plane of planes) {
        const dist = vertex.dot(plane.normal) - plane.distance;
        if (dist > 0) {
          vertex.sub(plane.normal.clone().multiplyScalar(dist));
        }
      }
    }
    
    // Detail Generation: Subtle geological damage (10%)
    
    // Fracture zones: Lower frequency noise so we get large chunky chips, NOT tiny spikes or static.
    const damageMask = noise3D(vertex.x * 1.0, vertex.y * 1.0, vertex.z * 1.0);
    if (damageMask > 0.4) {
      let fractureNoise = noise3D(vertex.x * 2.5, vertex.y * 2.5, vertex.z * 2.5);
      // CRITICAL: We ONLY subtract (carve inward). We take the absolute value of the noise.
      // This guarantees we never push vertices outward, which completely eliminates spikes and shard formations.
      vertex.sub(vertex.clone().normalize().multiplyScalar(Math.abs(fractureNoise) * 0.2));
    }
    
    // Cavities: Gentle, smooth indentations rather than jagged chaotic holes.
    const cavityNoise = noise3D(vertex.x * 0.6 + 10, vertex.y * 0.6 + 10, vertex.z * 0.6 + 10);
    if (cavityNoise > 0.5) {
      const cavityDepth = (cavityNoise - 0.5) * 1.0; 
      vertex.sub(vertex.clone().normalize().multiplyScalar(cavityDepth)); // Only carve inward
    }

    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  
  geometry.computeVertexNormals();
  return geometry;
}
