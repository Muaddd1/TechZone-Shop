import { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Text,
  MeshTransmissionMaterial,
  Environment,
  Sparkles,
  Preload,
} from '@react-three/drei';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { NavLink } from 'react-router-dom';

// ─── Product Data ─────────────────────────────────────────────────────────────
const phones = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    tagline: 'Titanium. Pro.',
    price: '$1,199',
    glow: '#3b82f6',
    glowAlt: '#60a5fa',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    specs: ['A17 Pro Chip', '48MP Camera', 'Titanium'],
  },
  {
    id: 2,
    name: 'Samsung S24 Ultra',
    tagline: 'Galaxy AI. Now.',
    price: '$1,099',
    glow: '#a855f7',
    glowAlt: '#c084fc',
    img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    specs: ['Snapdragon 8 Gen 3', '200MP Camera', 'S Pen'],
  },
  {
    id: 8,
    name: 'Google Pixel 8 Pro',
    tagline: 'The best camera.',
    price: '$999',
    glow: '#22c55e',
    glowAlt: '#4ade80',
    img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
    specs: ['Tensor G3', '50MP Camera', '7yr Updates'],
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    tagline: 'M3 Max. Pro.',
    price: '$2,499',
    glow: '#f97316',
    glowAlt: '#fb923c',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    specs: ['M3 Max', '40-core GPU', '128GB RAM'],
  },
];

const RING_RADIUS = 5;
const ANGLE_STEP = (2 * Math.PI) / phones.length;

// ─── Camera Controller ─────────────────────────────────────────────────────────
function CameraRig({ mouse }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetX = mouse.x * 2.5;
    const targetY = mouse.y * 1.2 + 1.5;
    const baseZ = 12;

    // eslint-disable-next-line react-hooks/immutability
    camera.position.x += (targetX - camera.position.x) * 0.04;
    // eslint-disable-next-line react-hooks/immutability
    camera.position.y += (targetY - camera.position.y) * 0.04;
    // eslint-disable-next-line react-hooks/immutability
    camera.position.z += (baseZ - camera.position.z) * 0.04;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── 3D Phone Card ────────────────────────────────────────────────────────────
function PhoneCard({ phone, index, activeIndex, mouse, onClick }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const angle = index * ANGLE_STEP - Math.PI / 2;
  const isActive = index === activeIndex;

  const posX = Math.sin(angle) * RING_RADIUS;
  const posZ = Math.cos(angle) * RING_RADIUS;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Float animation
    groupRef.current.position.y = Math.sin(t * 0.5 + index * 1.2) * 0.15;

    // Point toward center
    const targetRotY = -angle + Math.PI;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.06;

    // Active card scales up and moves slightly forward
    const targetScale = isActive ? 1.15 : 0.72;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08)
    );

    // Mouse parallax offset per card
    const parallaxStrength = isActive ? 0.3 : 0.1;
    groupRef.current.position.x = posX + mouse.x * parallaxStrength;
    groupRef.current.position.z = posZ + mouse.y * parallaxStrength;
  });

  return (
    <group
      ref={groupRef}
      position={[posX, 0, posZ]}
      onClick={() => onClick(index)}
    >
      {/* Glow plane behind */}
      <mesh position={[0, 0, -0.5]} scale={[2.2, 3.2, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          color={phone.glow}
          transparent
          opacity={isActive ? 0.25 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glass card body */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.9, 3.2, 0.06]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={256}
          transmission={0.92}
          roughness={0.08}
          thickness={0.3}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.2}
          color={isActive ? phone.glow : '#1e293b'}
          attenuationColor={phone.glow}
          attenuationDistance={0.5}
        />
      </mesh>

      {/* Product image on the card */}
      <Suspense
        fallback={
          <mesh position={[0, 0.4, 0.06]}>
            <planeGeometry args={[1.5, 2.0]} />
            <meshBasicMaterial color={phone.glow} transparent opacity={0.3} />
          </mesh>
        }
      >
        <PhoneImage phone={phone} />
      </Suspense>

      {/* Brand glow orb */}
      <mesh position={[0, -1.2, 0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={phone.glow} />
      </mesh>

      {/* Specs pills */}
      {isActive &&
        phone.specs.map((spec, si) => (
          <mesh key={spec} position={[-0.6 + si * 0.65, -1.55, 0.1]}>
            <planeGeometry args={[0.58, 0.22]} />
            <meshBasicMaterial color={phone.glow} transparent opacity={0.15} />
          </mesh>
        ))}
    </group>
  );
}

// ─── Particle Field ───────────────────────────────────────────────────────────
// Pre-computed particle positions to avoid Math.random during render
const PARTICLE_POSITIONS = (() => {
  const count = 300;
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 30;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  }
  return arr;
})();

function ParticleField() {

  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Grid Floor ───────────────────────────────────────────────────────────────
function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial
        color="#0f172a"
        transparent
        opacity={0}
      />
      <gridHelper
        args={[40, 40, '#1e3a5f', '#0f172a']}
        position={[0, 0, 0]}
      />
    </mesh>
  );
}

// ─── Floating Logo Text ───────────────────────────────────────────────────────
function FloatingText({ activePhone }) {
  return (
    <group position={[0, 3.5, 0]}>
      <Text
        fontSize={0.45}
        color={activePhone?.glow ?? '#60a5fa'}
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        TECHZONE
      </Text>
    </group>
  );
}

// ─── Light Setup ──────────────────────────────────────────────────────────────
function Lights({ activePhone }) {
  const lightColor = activePhone?.glow ?? '#3b82f6';
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 8, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-6, 2, 3]} intensity={1.5} color={lightColor} />
      <pointLight position={[6, -2, 3]} intensity={1.2} color="#60a5fa" />
      <spotLight
        position={[0, 10, 0]}
        intensity={3}
        angle={0.4}
        penumbra={0.8}
        color="#ffffff"
        castShadow
      />
    </>
  );
}

// ─── Phone Image Texture (loads async inside Canvas) ─────────────────────────
function PhoneImage({ phone }) {
  const texture = useLoader(THREE.TextureLoader, phone.img);
  const tex = useMemo(() => {
    const t = texture.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [texture]);
  return (
    <mesh position={[0, 0.4, 0.06]}>
      <planeGeometry args={[1.5, 2.0]} />
      <meshBasicMaterial map={tex} transparent opacity={1} />
    </mesh>
  );
}


// ─── Main Scene ───────────────────────────────────────────────────────────────
function Scene({ onActivePhone, mouse }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (idx) => {
    setActiveIndex(idx);
    onActivePhone(phones[idx]);
  };

  useFrame(() => {
    // Update active phone info
    onActivePhone(phones[activeIndex]);
  });

  return (
    <>
      <CameraRig mouse={mouse} activeIndex={activeIndex} />
      <Lights activePhone={phones[activeIndex]} />
      <ParticleField />
      <Sparkles
        count={80}
        scale={12}
        size={1.2}
        speed={0.3}
        color="#60a5fa"
        opacity={0.4}
      />
      <GridFloor />
      <FloatingText activePhone={phones[activeIndex]} />

      {phones.map((phone, i) => (
        <PhoneCard
          key={phone.id}
          phone={phone}
          index={i}
          activeIndex={activeIndex}
          mouse={mouse}
          onClick={handleClick}
        />
      ))}

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0005]}
        />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>

      <Preload all />
    </>
  );
}

// ─── Navigation Dots ─────────────────────────────────────────────────────────
function NavDots({ phones, activeIndex, onSelect }) {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
      {phones.map((p, i) => (
        <button
          key={p.id}
          onClick={() => onSelect(i)}
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: i === activeIndex ? '2rem' : '0.5rem',
            background: i === activeIndex ? p.glow : 'rgba(255,255,255,0.3)',
            boxShadow: i === activeIndex ? `0 0 8px ${p.glow}` : 'none',
          }}
          aria-label={`View ${p.name}`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhoneShowcase() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activePhone, setActivePhone] = useState(phones[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const handleSelect = (idx) => setActiveIndex(idx);

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene
            onActivePhone={(p) => {
              setActivePhone(p);
            }}
            mouse={mouse}
          />
        </Suspense>
      </Canvas>

      {/* Product Info Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 px-8">
        {/* Top: product name */}
        <div className="flex flex-col items-center mt-4">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-2 transition-colors duration-500"
            style={{ color: activePhone?.glow }}
          >
            {activePhone?.name}
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-white text-center transition-all duration-500"
            style={{ textShadow: `0 0 30px ${activePhone?.glow ?? '#3b82f6'}80` }}
          >
            {activePhone?.tagline}
          </h2>
          <p
            className="text-3xl font-bold mt-2 transition-colors duration-500"
            style={{ color: activePhone?.glow }}
          >
            {activePhone?.price}
          </p>
        </div>

        {/* Bottom: CTA */}
        <div className="flex flex-col items-center gap-4 pointer-events-auto">
          <NavDots
            phones={phones}
            activeIndex={activeIndex}
            onSelect={handleSelect}
          />
          <div className="flex gap-3">
            <NavLink
              to={`/product/${activePhone?.id}`}
              className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: activePhone?.glow ?? '#3b82f6',
                color: '#fff',
                boxShadow: `0 0 24px ${activePhone?.glow ?? '#3b82f6'}60`,
              }}
            >
              View Details
            </NavLink>
            <NavLink
              to="/shop"
              className="px-8 py-3 rounded-full text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-300"
            >
              Shop All
            </NavLink>
          </div>
        </div>
      </div>

      {/* Scan line overlay for CRT feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />
    </div>
  );
}
