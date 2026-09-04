import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function IphoneBody({ screenTexture }) {
  const screenRef = useRef();
  const frameColor = '#2a2a2e';
  const frameColorLight = '#3a3a3e';
  const backColor = '#1c1c1e';
  useFrame(() => {
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.15 + Math.sin(Date.now() * 0.001) * 0.02;
    }
  });
  return (
    <group>
      <mesh position={[0, 0, 0.012]}>
        <boxGeometry args={[2.04, 4.26, 0.005]} />
        <meshStandardMaterial color="#111113" roughness={0.05} metalness={0.1} />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, 0.015]}>
        <boxGeometry args={[1.92, 4.14, 0.001]} />
        <meshStandardMaterial map={screenTexture} emissiveMap={screenTexture} emissive={new THREE.Color('#ffffff')} emissiveIntensity={0.15} roughness={0.0} metalness={0.0} />
      </mesh>
      <mesh position={[0, 2.18, 0]}><boxGeometry args={[2.08, 0.12, 0.008]} /><meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.8} /></mesh>
      <mesh position={[0, -2.18, 0]}><boxGeometry args={[2.08, 0.12, 0.008]} /><meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.8} /></mesh>
      <mesh position={[-1.0, 0, 0]}><boxGeometry args={[0.08, 4.44, 0.008]} /><meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.8} /></mesh>
      <mesh position={[1.0, 0, 0]}><boxGeometry args={[0.08, 4.44, 0.008]} /><meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.8} /></mesh>
      <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}><boxGeometry args={[2.04, 4.26, 0.005]} /><meshStandardMaterial color={backColor} roughness={0.2} metalness={0.3} /></mesh>
      <mesh position={[-0.42, 1.7, -0.04]}><boxGeometry args={[1.1, 0.65, 0.025]} /><meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.2} /></mesh>
      {[[-0.7, 1.82], [-0.3, 1.82], [-0.5, 1.52]].map(([lx, ly], i) => (
        <group key={i}>
          <mesh position={[lx, ly, -0.05]}><cylinderGeometry args={[0.18, 0.18, 0.06, 32]} /><meshStandardMaterial color="#080808" roughness={0.1} metalness={0.9} /></mesh>
          <mesh position={[lx, ly, -0.035]}><cylinderGeometry args={[0.14, 0.14, 0.04, 32]} /><meshStandardMaterial color="#1a1a2e" roughness={0.0} metalness={1.0} /></mesh>
        </group>
      ))}
      <mesh position={[-0.12, 1.88, -0.04]}><cylinderGeometry args={[0.06, 0.06, 0.02, 16]} /><meshStandardMaterial color="#f0f0ff" emissive="#f0f0ff" emissiveIntensity={0.5} /></mesh>
      <mesh position={[0.05, 1.52, -0.04]}><cylinderGeometry args={[0.05, 0.05, 0.02, 16]} /><meshStandardMaterial color="#111111" roughness={0.0} metalness={0.8} /></mesh>
      <mesh position={[1.05, 0.4, 0]}><boxGeometry args={[0.04, 0.3, 0.1]} /><meshStandardMaterial color={frameColorLight} roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[-1.05, 0.8, 0]}><boxGeometry args={[0.035, 0.22, 0.1]} /><meshStandardMaterial color={frameColorLight} roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[-1.05, 0.3, 0]}><boxGeometry args={[0.035, 0.22, 0.1]} /><meshStandardMaterial color={frameColorLight} roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[-1.05, -0.2, 0]}><boxGeometry args={[0.035, 0.14, 0.1]} /><meshStandardMaterial color="#ff9500" roughness={0.2} metalness={0.5} /></mesh>
      <mesh position={[0, 2.03, 0.018]}><boxGeometry args={[0.78, 0.22, 0.005]} /><meshStandardMaterial color="#000000" roughness={0.1} metalness={0.2} /></mesh>
      <mesh position={[0, 2.25, 0]}><boxGeometry args={[2.08, 0.01, 0.008]} /><meshStandardMaterial color="#4a4a4e" roughness={0.1} metalness={1.0} /></mesh>
    </group>
  );
}

function drawScreenContent(ctx, width, height, section) {
  ctx.clearRect(0, 0, width, height);
  if (section === 0) {
    ctx.fillStyle = '#0f0f13';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px system-ui';
    ctx.fillText('9:41', 10, 16);
    ctx.fillStyle = '#888';
    ctx.fillText('TechZone', width / 2 - 18, 16);
    ctx.fillRect(width - 40, 8, 6, 8);
    ctx.fillRect(width - 32, 10, 6, 6);
    ctx.fillRect(width - 24, 12, 6, 4);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText('TechZone', 12, 42);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Shop', width / 2 - 20, 42);
    ctx.fillStyle = '#888';
    ctx.font = '10px system-ui';
    ctx.fillText('Discover', width / 2 + 8, 42);
    ctx.fillText('About', width - 60, 42);
    const cardW = width / 2 - 10;
    const cardH = 80;
    const products = [
      { name: 'iPhone 15 Pro', price: '$1199', color: '#3b82f6', img: String.fromCodePoint(0x1f4f1) },
      { name: 'MacBook Pro 16"', price: '$2499', color: '#a855f7', img: String.fromCodePoint(0x1f4bb) },
      { name: 'AirPods Pro', price: '$249', color: '#f97316', img: String.fromCodePoint(0x1f3a7) },
      { name: 'Galaxy S24', price: '$1099', color: '#22c55e', img: String.fromCodePoint(0x1f4f1) },
    ];
    products.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 6 + col * (cardW + 4);
      const y = 56 + row * (cardH + 6);
      ctx.fillStyle = '#1a1a22';
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 8);
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x + 4, y + 4, 36, 36);
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.color;
      ctx.font = '20px system-ui';
      ctx.fillText(p.img, x + 8, y + 28);
      ctx.fillStyle = '#fff';
      ctx.font = '10px system-ui';
      ctx.fillText(p.name, x + 48, y + 22);
      ctx.fillStyle = p.color;
      ctx.font = 'bold 11px system-ui';
      ctx.fillText(p.price, x + 48, y + 38);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(x + cardW - 36, y + cardH - 22, 30, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '8px system-ui';
      ctx.fillText('Buy', x + cardW - 26, y + cardH - 11);
    });
    ctx.fillStyle = '#0a0a0e';
    ctx.fillRect(0, height - 56, width, 56);
    const tabs = [String.fromCodePoint(0x1f3e0), String.fromCodePoint(0x1f4f1), String.fromCodePoint(0x1f6d2), String.fromCodePoint(0x2764), String.fromCodePoint(0x1f464)];
    const labels = ['Home', 'Shop', 'Cart', 'Wish', 'Profile'];
    tabs.forEach((tab, i) => {
      const tx = (width / 5) * i + width / 10;
      ctx.fillStyle = i === 0 ? '#3b82f6' : '#555';
      ctx.font = '14px system-ui';
      ctx.fillText(tab, tx - 6, height - 32);
      ctx.fillStyle = i === 0 ? '#3b82f6' : '#555';
      ctx.font = '7px system-ui';
      ctx.fillText(labels[i], tx - 14, height - 14);
    });
  } else if (section === 1) {
    ctx.fillStyle = '#0f0f13';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.font = '10px system-ui';
    ctx.fillText('9:41', 10, 16);
    for (let i = 0; i < 4; i++) ctx.fillRect(width - 40 + i * 8, 10, 6, 6);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(6, 24, 28, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px system-ui';
    ctx.fillText('<', 12, 37);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText('iPhone 17 Pro Max', 42, 32);
    ctx.fillStyle = '#888';
    ctx.font = '9px system-ui';
    ctx.fillText('Apple', 42, 44);
    ctx.fillStyle = '#1a1a22';
    ctx.beginPath();
    ctx.roundRect(6, 54, width - 12, 160, 12);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(width / 2 - 60, 80, 120, 120);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#3b82f6';
    ctx.font = '64px system-ui';
    ctx.fillText(String.fromCodePoint(0x1f4f1), width / 2 - 24, 175);
    ctx.fillStyle = '#fff';
    ctx.font = '9px system-ui';
    ctx.fillText('Color', 12, 228);
    ['#e8e8ed', '#4a4a4e', '#0a0a0a', '#1c3a6e'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(28 + i * 22, 240, 9, 0, Math.PI * 2);
      ctx.fill();
      if (i === 0) { ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.stroke(); }
    });
    ctx.fillStyle = '#fff';
    ctx.font = '9px system-ui';
    ctx.fillText('Storage', 12, 264);
    ['128GB', '256GB', '512GB', '1TB'].forEach((s, i) => {
      const sx = 12 + i * 50;
      ctx.fillStyle = i === 0 ? '#3b82f6' : '#1e1e26';
      ctx.beginPath();
      ctx.roundRect(sx, 270, 44, 18, 4);
      ctx.fill();
      ctx.fillStyle = i === 0 ? '#fff' : '#888';
      ctx.font = '8px system-ui';
      ctx.fillText(s, sx + 6, 282);
    });
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px system-ui';
    ctx.fillText('$1,399', 12, 308);
    ctx.fillStyle = '#888';
    ctx.font = '10px system-ui';
    ctx.fillText('$1,599', 72, 308);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(6, 316, width - 12, 36, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('Add to Cart', width / 2 - 30, 338);
    ctx.fillStyle = '#0a0a0e';
    ctx.fillRect(0, height - 56, width, 56);
  } else if (section === 2) {
    ctx.fillStyle = '#0a0a10';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('iPhone 17 Pro Max', width / 2 - 50, 28);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '8px system-ui';
    ctx.fillText('by TechZone', width / 2 - 22, 40);
    const specs = [
      { label: 'Chip', value: 'A19 Pro', icon: String.fromCodePoint(0x26a1) },
      { label: 'Camera', value: '48MP + 48MP + 12MP', icon: String.fromCodePoint(0x1f4f7) },
      { label: 'Display', value: '6.9" OLED 120Hz', icon: String.fromCodePoint(0x1f5a5) },
      { label: 'Battery', value: '29 Hours', icon: String.fromCodePoint(0x1f50b) },
      { label: 'Storage', value: 'Up to 2TB', icon: String.fromCodePoint(0x1f4be) },
      { label: 'Titanium', value: 'Grade 5', icon: String.fromCodePoint(0x1f529) },
    ];
    specs.forEach((s, i) => {
      const y = 60 + i * 46;
      ctx.fillStyle = '#12121a';
      ctx.beginPath();
      ctx.roundRect(6, y, width - 12, 40, 8);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.font = '16px system-ui';
      ctx.fillText(s.icon, 14, y + 26);
      ctx.fillStyle = '#fff';
      ctx.font = '10px system-ui';
      ctx.fillText(s.label, 40, y + 18);
      ctx.fillStyle = '#aaa';
      ctx.font = '9px system-ui';
      ctx.fillText(s.value, 40, y + 32);
    });
  } else if (section === 3) {
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('Camera', 12, 22);
    ctx.fillStyle = '#f97316';
    ctx.font = '9px system-ui';
    ctx.fillText('48MP Main', 12, 34);
    ctx.strokeStyle = '#ffffff30';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(width / 2 - 70, 50, 140, 180);
    const photos = [
      { x: 8, y: 46, w: width / 2 - 14, h: 85, c: '#1e3a5f', label: '1x Main' },
      { x: width / 2 + 2, y: 46, w: width / 2 - 10, h: 85, c: '#2d1f3d', label: '5x Tele' },
      { x: 8, y: 137, w: width / 2 - 14, h: 85, c: '#1a3d2e', label: 'Ultra Wide' },
      { x: width / 2 + 2, y: 137, w: width / 2 - 10, h: 85, c: '#3d2d1a', label: 'Macro' },
    ];
    photos.forEach((p) => {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 6);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '7px system-ui';
      ctx.fillText(p.label, p.x + 4, p.y + 10);
    });
    ctx.fillStyle = '#fff';
    ctx.font = '8px system-ui';
    ctx.fillText('0.5x', 8, 235);
    ctx.fillText('1x', width / 2 - 5, 235);
    ctx.fillText('5x', width - 25, 235);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, height - 30, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '7px system-ui';
    ctx.fillText('REC', 28, height - 26);
    ctx.fillText('4K 60fps', width / 2 - 16, height - 26);
  } else {
    ctx.fillStyle = '#0f0f13';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('Your Cart (2)', 12, 22);
    const items = [
      { name: 'iPhone 17 Pro Max', variant: '256GB Natural', price: '$1,399', emoji: String.fromCodePoint(0x1f4f1) },
      { name: 'AirPods Pro 2', variant: 'USB-C', price: '$249', emoji: String.fromCodePoint(0x1f3a7) },
    ];
    items.forEach((item, i) => {
      const y = 34 + i * 54;
      ctx.fillStyle = '#1a1a22';
      ctx.beginPath();
      ctx.roundRect(6, y, width - 12, 48, 8);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.globalAlpha = 0.2;
      ctx.fillRect(10, y + 4, 36, 36);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#3b82f6';
      ctx.font = '20px system-ui';
      ctx.fillText(item.emoji, 14, y + 30);
      ctx.fillStyle = '#fff';
      ctx.font = '10px system-ui';
      ctx.fillText(item.name, 54, y + 18);
      ctx.fillStyle = '#888';
      ctx.font = '8px system-ui';
      ctx.fillText(item.variant, 54, y + 30);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px system-ui';
      ctx.fillText(item.price, 54, y + 42);
      ctx.fillStyle = '#555';
      ctx.fillRect(width - 50, y + 16, 38, 18);
      ctx.fillStyle = '#fff';
      ctx.font = '10px system-ui';
      ctx.fillText('1', width - 38, y + 29);
    });
    ctx.fillStyle = '#1a1a22';
    ctx.beginPath();
    ctx.roundRect(6, 148, width - 12, 34, 6);
    ctx.fill();
    ctx.fillStyle = '#888';
    ctx.font = '9px system-ui';
    ctx.fillText('Subtotal', 14, 166);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('$1,648', width - 60, 166);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '8px system-ui';
    ctx.fillText('Free shipping', 14, 178);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(6, 188, width - 12, 34, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('Checkout ' + String.fromCodePoint(0x2192), width / 2 - 30, 209);
    ctx.fillStyle = '#0a0a0e';
    ctx.fillRect(0, height - 56, width, 56);
  }
}

// Pre-computed particle positions to avoid Math.random during render
const PARTICLE_POSITIONS = (() => {
  const arr = new Float32Array(120 * 3);
  for (let i = 0; i < 120; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  return arr;
})();

function useScreenTexture(section) {
  // Recreate texture when section changes - CanvasTexture is lightweight enough
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 868;
    const ctx = canvas.getContext('2d');
    drawScreenContent(ctx, canvas.width, canvas.height, section);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [section]);

  return texture;
}

function DynamicPhone({ section }) {
  const screenTexture = useScreenTexture(section);
  return (
    <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.15}>
      <IphoneBody screenTexture={screenTexture} />
    </Float>
  );
}

function AmbientParticles() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} /></bufferGeometry>
      <pointsMaterial size={0.025} color="#3b82f6" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={1.0} color="#3b82f6" />
      <pointLight position={[4, -2, 3]} intensity={0.6} color="#8b5cf6" />
      <spotLight position={[0, 12, 4]} intensity={2} angle={0.3} penumbra={0.9} color="#ffffff" />
    </>
  );
}

function InnerScene({ section }) {
  const { camera } = useThree();
  useFrame(() => { camera.lookAt(0, 0, 0); });
  return (
    <>
      <Lights />
      <AmbientParticles />
      <Environment preset="city" />
      <DynamicPhone section={section} />
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.7} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export default function HeroScene({ section }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ position: 'absolute', inset: 0 }}>
      <Suspense fallback={null}>
        <InnerScene section={section} />
      </Suspense>
    </Canvas>
  );
}
