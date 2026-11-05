import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ theme = 'honeybee' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isObsidian = theme === 'obsidian';
    // In white theme: completely remove black background wireframes so text is 100% legible
    const primaryColor = isObsidian ? 0x3f3f46 : 0xfef08a;
    const accentYellow = 0xfacc15; // Honeybee Yellow beacons
    const secondaryYellow = 0xeab308;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isObsidian ? 0x09090b : 0xfafafa, 0.02);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 18, 42);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Procedural Undulating Cyber Terrain Mesh (Very subtle in white theme, no black background)
    const gridCols = 55;
    const gridRows = 55;
    const terrainGeom = new THREE.PlaneGeometry(120, 120, gridCols, gridRows);
    terrainGeom.rotateX(-Math.PI / 2.2);

    const posAttr = terrainGeom.attributes.position;
    const origPositions = new Float32Array(posAttr.array); // snapshot base coords

    const terrainMat = new THREE.MeshBasicMaterial({
      color: isObsidian ? 0x3f3f46 : 0xfde047,
      wireframe: true,
      transparent: true,
      opacity: isObsidian ? 0.32 : 0.04
    });

    const terrain = new THREE.Mesh(terrainGeom, terrainMat);
    terrain.position.y = -8;
    scene.add(terrain);

    // 3. Glowing Crest Nodes (Points layered on terrain vertices)
    const crestPointsGeom = new THREE.BufferGeometry();
    const crestCount = 180;
    const crestPositions = new Float32Array(crestCount * 3);
    const crestColors = new Float32Array(crestCount * 3);

    const c1 = new THREE.Color(accentYellow);
    const c2 = new THREE.Color(secondaryYellow);

    for (let i = 0; i < crestCount; i++) {
      crestPositions[i * 3] = (Math.random() - 0.5) * 90;
      crestPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      crestPositions[i * 3 + 2] = (Math.random() - 0.5) * 70;

      const col = Math.random() > 0.4 ? c1 : c2;
      crestColors[i * 3] = col.r;
      crestColors[i * 3 + 1] = col.g;
      crestColors[i * 3 + 2] = col.b;
    }

    crestPointsGeom.setAttribute('position', new THREE.BufferAttribute(crestPositions, 3));
    crestPointsGeom.setAttribute('color', new THREE.BufferAttribute(crestColors, 3));

    const crestPointsMat = new THREE.PointsMaterial({
      size: isObsidian ? 0.9 : 0.6,
      vertexColors: true,
      transparent: true,
      opacity: isObsidian ? 0.85 : 0.25,
      blending: isObsidian ? THREE.AdditiveBlending : THREE.NormalBlending
    });

    const crestPoints = new THREE.Points(crestPointsGeom, crestPointsMat);
    scene.add(crestPoints);

    // 4. Floating 3D Geometric Energy Rings & Orbs
    const energyGroup = new THREE.Group();
    scene.add(energyGroup);

    // Ring 1
    const ring1Geom = new THREE.TorusGeometry(8, 0.08, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: isObsidian ? 0x3f3f46 : 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: isObsidian ? 0.4 : 0.08
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.position.set(-28, 14, -10);
    ring1.rotation.x = Math.PI / 4;
    energyGroup.add(ring1);

    // Ring 2
    const ring2Geom = new THREE.TorusGeometry(12, 0.08, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: secondaryYellow,
      wireframe: true,
      transparent: true,
      opacity: isObsidian ? 0.4 : 0.08
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.position.set(30, 8, -15);
    ring2.rotation.y = Math.PI / 3;
    energyGroup.add(ring2);

    // Polyhedron Node
    const polyGeom = new THREE.OctahedronGeometry(2.5, 0);
    const polyMat = new THREE.MeshBasicMaterial({
      color: accentYellow,
      wireframe: true,
      transparent: true,
      opacity: isObsidian ? 0.45 : 0.1
    });
    const polyMesh = new THREE.Mesh(polyGeom, polyMat);
    polyMesh.position.set(0, 16, -20);
    energyGroup.add(polyMesh);

    // 5. Interactive Mouse Parallax & Dynamic Ripples
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 18;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Dynamic Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const time = clock.getElapsedTime();

      // Camera smooth damping towards mouse position
      targetCameraX += (mouseX * 1.5 - targetCameraX) * 0.04;
      targetCameraY += (18 - mouseY * 0.8 - targetCameraY) * 0.04;
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY;
      camera.lookAt(0, -2, 0);

      // Undulate Cyber Terrain Mesh Vertices
      const pos = terrainGeom.attributes.position;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const u = origPositions[i * 3];     // X
        const v = origPositions[i * 3 + 1]; // Y
        // Calculate harmonic wave height
        const wave = Math.sin(u * 0.12 + time * 1.2) * Math.cos(v * 0.12 + time * 0.9) * 2.8 +
                     Math.sin((u + v) * 0.08 + time * 0.7) * 1.6;
        
        pos.setZ(i, origPositions[i * 3 + 2] + wave);
      }
      pos.needsUpdate = true;

      // Rotate geometric energy structures
      ring1.rotation.z += 0.005;
      ring1.rotation.y += 0.004;
      ring2.rotation.x += 0.006;
      ring2.rotation.z -= 0.003;
      polyMesh.rotation.x += 0.01;
      polyMesh.rotation.y += 0.015;

      // Float crest points
      crestPoints.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      terrainGeom.dispose();
      terrainMat.dispose();
      crestPointsGeom.dispose();
      crestPointsMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      polyGeom.dispose();
      polyMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
}
