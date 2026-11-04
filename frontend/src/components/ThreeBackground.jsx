import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ theme = 'royal' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isRoyal = theme === 'royal';
    const primaryColor = isRoyal ? 0x1d4ed8 : 0x2563eb;
    const accentRed = isRoyal ? 0xdc2626 : 0x00d293;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Ambient Particles (Constellation)
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cPrimary = new THREE.Color(primaryColor);
    const cAccent = new THREE.Color(accentRed);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const pickColor = Math.random() > 0.35 ? cPrimary : cAccent;
      colors[i * 3] = pickColor.r;
      colors[i * 3 + 1] = pickColor.g;
      colors[i * 3 + 2] = pickColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: isRoyal ? 0.45 : 0.6,
      blending: isRoyal ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Floating 3D Geometric Grid Waves
    const gridHelper = new THREE.GridHelper(100, 30, primaryColor, isRoyal ? 0xe2e8f0 : 0x1e293b);
    gridHelper.position.y = -18;
    gridHelper.rotation.x = 0.2;
    scene.add(gridHelper);

    // 4. Subtle Floating Icosahedron Energy Crystals
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    const crystalGeom = new THREE.IcosahedronGeometry(1.8, 0);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: isRoyal ? 0.22 : 0.3
    });

    const c1 = new THREE.Mesh(crystalGeom, crystalMat);
    c1.position.set(-25, 12, -10);
    crystalGroup.add(c1);

    const c2 = new THREE.Mesh(crystalGeom, new THREE.MeshBasicMaterial({
      color: accentRed,
      wireframe: true,
      transparent: true,
      opacity: isRoyal ? 0.25 : 0.3
    }));
    c2.position.set(28, -8, -15);
    crystalGroup.add(c2);

    const c3 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.05, 16, 50), crystalMat);
    c3.position.set(0, 20, -25);
    c3.rotation.x = Math.PI / 3;
    crystalGroup.add(c3);

    // 5. Mouse Parallax Reaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.015;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.015;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const time = clock.getElapsedTime();

      // Smooth mouse parallax
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      particles.rotation.y = time * 0.02 + targetX * 0.5;
      particles.rotation.x = targetY * 0.3;

      // Crystals rotation
      c1.rotation.x += 0.008;
      c1.rotation.y += 0.012;
      c2.rotation.y -= 0.01;
      c2.rotation.z += 0.006;
      c3.rotation.z += 0.004;

      // Floating grid wave
      gridHelper.position.z = (time * 2) % 3.33;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      crystalGeom.dispose();
      crystalMat.dispose();
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
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: theme === 'royal' ? 0.75 : 0.85
      }} 
    />
  );
}

