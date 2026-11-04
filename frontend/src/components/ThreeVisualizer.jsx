import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, EyeOff, RotateCw, Sparkles } from 'lucide-react';

export default function ThreeVisualizer({ theme = 'obsidian', mode = 'energy_core' }) {
  const mountRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInteractive, setIsInteractive] = useState(false);
  const reqIdRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 220;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio for high mobile performance
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Color definitions based on theme
    const isRoyal = theme === 'royal';
    const primaryColor = isRoyal ? 0x1d4ed8 : 0x2563eb; // Royal Blue
    const accentRed = isRoyal ? 0xdc2626 : 0xef4444;    // Crimson Red
    const accentCyan = isRoyal ? 0x0284c7 : 0x00d293;   // Cyan / Mint

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isRoyal ? 1.4 : 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(primaryColor, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(accentRed, 2.0);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    // 3. Central Holographic Core (Battery Cell / EV Power Matrix)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Central Battery Cylinder (Pivotal Cell)
    const cellGeom = new THREE.CylinderGeometry(0.75, 0.75, 2.2, 32);
    const cellMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });
    const cellMesh = new THREE.Mesh(cellGeom, cellMat);
    coreGroup.add(cellMesh);

    // Battery Terminal Top (+ Node)
    const capGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: accentRed,
      metalness: 0.9,
      roughness: 0.1,
      emissive: accentRed,
      emissiveIntensity: 0.3
    });
    const capMesh = new THREE.Mesh(capGeom, capMat);
    capMesh.position.y = 1.25;
    coreGroup.add(capMesh);

    // Outer Torus Ring 1 (Royal Blue Orbit)
    const ring1Geom = new THREE.TorusGeometry(1.5, 0.04, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.4,
      metalness: 0.7
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Outer Torus Ring 2 (Crimson Red Orbit)
    const ring2Geom = new THREE.TorusGeometry(1.8, 0.035, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: accentRed,
      emissive: accentRed,
      emissiveIntensity: 0.5,
      metalness: 0.7
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // Outer Wireframe Cage (Energy Shield)
    const shieldGeom = new THREE.IcosahedronGeometry(2.3, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: isRoyal ? 0x2563eb : 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: isRoyal ? 0.35 : 0.25
    });
    const shield = new THREE.Mesh(shieldGeom, shieldMat);
    coreGroup.add(shield);

    // 4. Energy Particles (Dust Flow)
    const particleCount = 80; // Keep lightweight
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: isRoyal ? 0xdc2626 : 0x00d293,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Mouse Interaction for Free Rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsInteractive(true);
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.style.cursor = 'grab';
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Battery Saving Optimization: Pause when offscreen
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return; // 0% CPU consumption when hidden

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth auto-spin + mouse tracking
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05 + 0.012;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      ring1.rotation.z += 0.02;
      ring2.rotation.x += 0.015;
      shield.rotation.y -= 0.005;

      // Gentle floating hover effect
      coreGroup.position.y = Math.sin(time * 2) * 0.12;

      // Pulse core opacity
      cellMat.opacity = 0.75 + Math.sin(time * 3) * 0.15;

      // Particle slow orbit
      particles.rotation.y += 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
      cellGeom.dispose();
      cellMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      shieldGeom.dispose();
      shieldMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '210px' }}>
      {/* Three.js Canvas Container */}
      <div 
        ref={mountRef} 
        style={{ width: '100%', height: '100%', minHeight: '210px', touchAction: 'none' }} 
        title="Interactive 3D EV Core: Drag to Rotate"
      />

      {/* Floating 3D Control Pill */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: theme === 'royal' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)',
        border: theme === 'royal' ? '1px solid #cbd5e1' : '1px solid #1e293b',
        borderRadius: '20px',
        padding: '3px 10px',
        fontSize: '0.7rem',
        color: theme === 'royal' ? '#1d4ed8' : '#60a5fa',
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)',
        fontWeight: 600
      }}>
        <RotateCw size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
        <span>3D EV Core • Drag to Rotate</span>
      </div>
    </div>
  );
}

