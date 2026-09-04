import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

gsap.registerPlugin(ScrollTrigger);

// ─── Quality Config by Tier ────────────────────────────────────────────────
function getQuality(tier, isMobile) {
  // Low-end: static phone, no particles, no effects
  if (tier === 'low') {
    return {
      particleCount: 0,
      enableBloom: false,
      enableFloat: false,
      enableEnvironment: false,
      enableParticles: false,
      lerpFactor: 0.15,
      useStaticPhone: true,
      dpr: 1,
      cameraZ: 8,
    };
  }

  // Mobile: optimized 3D with environment for realistic reflections
  if (isMobile) {
    return {
      particleCount: 20,
      enableBloom: true,
      enableFloat: true,
      enableEnvironment: true,
      enableParticles: true,
      lerpFactor: 0.12,
      useStaticPhone: false,
      dpr: [1, 1.5],
      cameraZ: 7,
    };
  }

  // Medium desktop
  if (tier === 'medium') {
    return {
      particleCount: 40,
      enableBloom: true,
      enableFloat: true,
      enableEnvironment: true,
      enableParticles: true,
      lerpFactor: 0.1,
      useStaticPhone: false,
      dpr: [1, 1.5],
      cameraZ: 7,
    };
  }

  // High tier desktop
  return {
    particleCount: 80,
    enableBloom: true,
    enableFloat: true,
    enableEnvironment: true,
    enableParticles: true,
    lerpFactor: 0.08,
    useStaticPhone: false,
    dpr: [1, 2],
    cameraZ: 7,
  };
}

// ─── iPhone 17 Pro Max 3D Body ───────────────────────────────────────────
function IPhoneBody() {
  const titaniumDark = '#2a2a2e';
  const titaniumLight = '#3a3a3e';

  const bodyW = 2.6;
  const bodyH = 5.1;
  const bodyD = 0.32;
  const screenW = 2.44;
  const screenH = 4.94;
  const radius = 0.18;

  return (
    <group>
      {/* Rounded titanium body */}
      <RoundedBox args={[bodyW, bodyH, bodyD]} radius={radius} smoothness={4}>
        <meshStandardMaterial
          color={titaniumDark}
          roughness={0.2}
          metalness={0.9}
          envMapIntensity={1.0}
        />
      </RoundedBox>

      {/* Screen glass — slight blue tint for realism */}
      <RoundedBox args={[screenW, screenH, 0.008]} radius={0.12} smoothness={4} position={[0, 0, bodyD / 2 + 0.001]}>
        <meshStandardMaterial
          color="#050510"
          roughness={0.0}
          metalness={0.0}
          envMapIntensity={0.2}
        />
      </RoundedBox>

      {/* Camera island — back */}
      <mesh position={[-0.45, 1.7, -bodyD / 2 - 0.015]}>
        <boxGeometry args={[1.15, 0.7, 0.035]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Camera lenses with glass effect */}
      {[[-0.72, 1.84], [-0.3, 1.84], [-0.52, 1.54]].map(([lx, ly], i) => (
        <group key={i}>
          {/* Lens outer ring */}
          <mesh position={[lx, ly, -bodyD / 2 - 0.025]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.05} metalness={0.98} />
          </mesh>
          {/* Lens glass */}
          <mesh position={[lx, ly, -bodyD / 2 - 0.005]}>
            <cylinderGeometry args={[0.13, 0.13, 0.04, 24]} />
            <meshStandardMaterial
              color="#0a0a18"
              roughness={0.0}
              metalness={0.1}
              transparent
              opacity={0.95}
            />
          </mesh>
          {/* Lens reflection highlight */}
          <mesh position={[lx + 0.04, ly + 0.04, -bodyD / 2 - 0.002]}>
            <cylinderGeometry args={[0.035, 0.035, 0.01, 16]} />
            <meshStandardMaterial color="#3a4060" roughness={0.0} metalness={0.2} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* True Tone Flash */}
      <mesh position={[-0.1, 2.0, -bodyD / 2 - 0.015]}>
        <cylinderGeometry args={[0.065, 0.065, 0.025, 16]} />
        <meshStandardMaterial color="#fff8e0" emissive="#ffe0a0" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>

      {/* LiDAR sensor */}
      <mesh position={[0.08, 1.58, -bodyD / 2 - 0.015]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.0} metalness={0.5} />
      </mesh>

      {/* Volume buttons — left side */}
      <mesh position={[-bodyW / 2 - 0.02, 0.7, 0]}>
        <boxGeometry args={[0.028, 0.2, 0.12]} />
        <meshStandardMaterial color={titaniumLight} roughness={0.15} metalness={0.95} />
      </mesh>
      <mesh position={[-bodyW / 2 - 0.02, 0.35, 0]}>
        <boxGeometry args={[0.028, 0.2, 0.12]} />
        <meshStandardMaterial color={titaniumLight} roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Power button — right side */}
      <mesh position={[bodyW / 2 + 0.02, 0.45, 0]}>
        <boxGeometry args={[0.028, 0.24, 0.12]} />
        <meshStandardMaterial color={titaniumLight} roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Dynamic Island */}
      <mesh position={[0, 1.78, bodyD / 2 + 0.005]}>
        <boxGeometry args={[0.82, 0.24, 0.008]} />
        <meshStandardMaterial color="#000000" roughness={0.05} metalness={0.1} />
      </mesh>

      {/* Dynamic Island cameras */}
      <mesh position={[-0.16, 1.78, bodyD / 2 + 0.006]}>
        <cylinderGeometry args={[0.065, 0.065, 0.012, 16]} />
        <meshStandardMaterial color="#080808" roughness={0.0} metalness={0.8} />
      </mesh>
      <mesh position={[0.16, 1.78, bodyD / 2 + 0.006]}>
        <cylinderGeometry args={[0.055, 0.055, 0.012, 16]} />
        <meshStandardMaterial color="#080808" roughness={0.0} metalness={0.8} />
      </mesh>

      {/* Speaker grille — bottom */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[-0.28 + i * 0.056, -bodyH / 2 - 0.018, 0.05]}>
          <boxGeometry args={[0.025, 0.01, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {/* USB-C port */}
      <mesh position={[0, -bodyH / 2 - 0.018, 0.05]}>
        <boxGeometry args={[0.26, 0.014, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* SIM tray */}
      <mesh position={[bodyW / 2 + 0.02, -0.3, 0]}>
        <boxGeometry args={[0.028, 0.12, 0.08]} />
        <meshStandardMaterial color={titaniumLight} roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Antenna lines — top */}
      <mesh position={[0, bodyH / 2 + 0.008, 0]}>
        <boxGeometry args={[bodyW - 0.5, 0.01, bodyD - 0.04]} />
        <meshStandardMaterial color={titaniumLight} roughness={0.15} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Phone driven by GSAP proxy ──────────────────────────────────────────
function DynamicPhone({ phoneProxy, lerpFactor, enableFloat }) {
  const groupRef = useRef();
  const _target = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!groupRef.current || !phoneProxy.current) return;
    const p = phoneProxy.current;
    _target.current.set(p.x, p.y, p.z);

    // Throttle updates on low-end by using larger lerp steps
    groupRef.current.position.lerp(_target.current, lerpFactor);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, p.rotX, lerpFactor);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, p.rotY, lerpFactor);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, p.rotZ, lerpFactor);
  });

  const phone = (
    <group ref={groupRef}>
      <IPhoneBody />
    </group>
  );

  if (enableFloat) {
    return <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.08}>{phone}</Float>;
  }
  return phone;
}

// ─── Ambient Particles (GPU pre-computed) ─────────────────────────────────
// Pre-computed positions for each tier — generated once at module load
const PARTICLE_POSITIONS_HIGH = (() => {
  const arr = new Float32Array(80 * 3);
  for (let i = 0; i < 80; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 18;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  return arr;
})();

const PARTICLE_POSITIONS_MEDIUM = (() => {
  const arr = new Float32Array(40 * 3);
  for (let i = 0; i < 40; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 18;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  return arr;
})();

function AmbientParticles({ count }) {
  const ref = useRef();
  const positions = count >= 80 ? PARTICLE_POSITIONS_HIGH : PARTICLE_POSITIONS_MEDIUM;

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Lights ───────────────────────────────────────────────────────────────
function Lights({ enableEnvironment }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={1.0} color="#3b82f6" />
      <pointLight position={[4, -2, 3]} intensity={0.6} color="#8b5cf6" />
      {enableEnvironment && <Environment preset="city" />}
    </>
  );
}

// ─── 3D Scene ───────────────────────────────────────────────────────────
function Scene({ phoneProxy, quality }) {
  const { enableBloom, enableParticles, enableEnvironment, enableFloat, particleCount, lerpFactor } = quality;

  useFrame(({ camera }) => {
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <Lights enableEnvironment={enableEnvironment} />
      {enableParticles && <AmbientParticles count={particleCount} />}
      <DynamicPhone phoneProxy={phoneProxy} lerpFactor={lerpFactor} enableFloat={enableFloat} />
      {enableBloom && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.3} luminanceThreshold={0.8} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

// ─── GSAP Scroll Animation ────────────────────────────────────────────────
function useScrollAnimation(phoneProxy, setSection, isMobile) {
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.getAll().forEach((st) => st.kill());

      const sections = [
        { id: '#section-0', x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 },
        { id: '#section-1', x: 0.6, y: -0.2, z: -0.3, rotX: -0.15, rotY: 0.25, rotZ: 0.05 },
        { id: '#section-2', x: -0.4, y: 0.2, z: -1.5, rotX: 0.1, rotY: -0.4, rotZ: 0.02 },
        { id: '#section-3', x: 1.2, y: 0, z: -0.5, rotX: 0, rotY: 0.6, rotZ: 0 },
        { id: '#section-4', x: 0, y: -0.1, z: 0, rotX: -0.05, rotY: 0, rotZ: 0 },
      ];

      // Mobile: use scroll position directly instead of ScrollTrigger
      if (isMobile) {
        const handleScroll = () => {
          const scrollY = window.scrollY;
          const winHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight - winHeight;
          const progress = Math.min(scrollY / docHeight, 1);

          // Map scroll progress to sections (5 sections)
          const sectionIndex = Math.min(Math.floor(progress * 5), 4);
          const sec = sections[sectionIndex];

          const p = phoneProxy.current;
          p.x = sec.x; p.y = sec.y; p.z = sec.z;
          p.rotX = sec.rotX; p.rotY = sec.rotY; p.rotZ = sec.rotZ;
          setSection(sectionIndex);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => {
          window.removeEventListener('scroll', handleScroll);
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      }

      // Desktop: use ScrollTrigger for smooth animation
      const updatePhone = (sec) => {
        const p = phoneProxy.current;
        p.x = sec.x; p.y = sec.y; p.z = sec.z;
        p.rotX = sec.rotX; p.rotY = sec.rotY; p.rotZ = sec.rotZ;
      };

      sections.forEach((sec, idx) => {
        ScrollTrigger.create({
          trigger: sec.id,
          start: 'top top',
          end: idx === 4 ? 'bottom bottom' : 'bottom top',
          onUpdate: () => updatePhone(sec),
          onEnter: () => setSection(idx),
        });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [phoneProxy, setSection, isMobile]);
}

// ─── Static Fallback Phone (for low-end) ─────────────────────────────────
function StaticPhone() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.6, 5.1, 0.32]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.17]}>
        <boxGeometry args={[2.44, 4.94, 0.001]} />
        <meshStandardMaterial color="#050510" roughness={0.0} metalness={0.0} />
      </mesh>
      <mesh position={[0, 1.78, 0.165]}>
        <boxGeometry args={[0.82, 0.24, 0.005]} />
        <meshStandardMaterial color="#000000" roughness={0.05} metalness={0.1} />
      </mesh>
    </group>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function Home() {
  const phoneProxy = useRef({ x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 });
  const [, setSection] = useState(0);

  const { tier, isMobile } = useDeviceCapability();
  const quality = getQuality(tier, isMobile);

  useScrollAnimation(phoneProxy, setSection, isMobile);

  return (
    <div className="relative w-full" style={{ height: '500vh' }}>
      {/* Fixed 3D Canvas */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, #234e8f 0%, #1a3870 40%, #122550 100%)' }}
      >
        {quality.useStaticPhone ? (
          // Low-end: render static phone without Canvas overhead
          <Canvas
            dpr={1}
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} intensity={0.8} />
            <StaticPhone />
          </Canvas>
        ) : (
          // Medium/High: full 3D experience
          <Canvas
            dpr={quality.dpr}
            camera={{ position: [0, 0, quality.cameraZ], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
            performance={{ min: 0.5 }}
          >
            <Suspense fallback={null}>
              <Scene phoneProxy={phoneProxy} quality={quality} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Scrollable Sections */}
      {/* Section 0: Hero */}
      <section
        id="section-0"
        className="relative z-10 flex items-center justify-center min-h-screen"
        style={{ background: 'transparent' }}
      >
        <div className="text-center max-w-xl px-6">
          <span className="inline-block bg-white/10 text-xs font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm text-white">
            {String.fromCodePoint(0x1f525)} Flagship phones, unbeatable prices
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            The future
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              in your hands.
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Explore the latest iPhones, Samsung Galaxy, and Google Pixel in our immersive 3D showcase.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <NavLink
              to="/shop"
              className="bg-white text-black font-semibold rounded-full px-8 py-4 hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </NavLink>
            <NavLink
              to="/about"
              className="border border-white/30 text-white font-semibold rounded-full px-8 py-4 hover:bg-white/10 transition-colors"
            >
              Learn More
            </NavLink>
          </div>
          <p className="text-gray-500 text-xs mt-6">Scroll to explore</p>
        </div>
      </section>

      {/* Section 1: Features */}
      <section
        id="section-1"
        className="relative z-10 flex items-center min-h-screen"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 grid lg:grid-cols-2 gap-8 items-center">
          <div className="lg:pl-8">
            <span className="text-xs font-semibold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
              A19 Pro Chip
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              Power like<br />never before.
            </h2>
            <p className="text-gray-400 mb-6 max-w-sm">
              The A19 Pro delivers unprecedented performance with a 6-core CPU and 20-core GPU,
              making every interaction feel instant.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'CPU Cores', value: '6' },
                { label: 'GPU Cores', value: '20' },
                { label: 'Transistors', value: '19B' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* Section 2: Specs */}
      <section
        id="section-2"
        className="relative z-10 flex items-center min-h-screen"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">
              Full Specifications
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              Built for the bold.
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Every detail refined. Every material chosen with intention.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: String.fromCodePoint(0x26a1), label: 'A19 Pro Chip', sub: '3nm process' },
              { icon: String.fromCodePoint(0x1f4f7), label: '48MP Camera', sub: 'Quad-pixel sensor' },
              { icon: String.fromCodePoint(0x1f5a5), label: '6.9" Display', sub: 'OLED 120Hz ProMotion' },
              { icon: String.fromCodePoint(0x1f50b), label: '29hr Battery', sub: 'All-day power' },
              { icon: String.fromCodePoint(0x1f4be), label: 'Up to 2TB', sub: 'Massive storage' },
              { icon: String.fromCodePoint(0x1f529), label: 'Titanium', sub: 'Grade 5 alloy' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-white font-semibold">{s.label}</div>
                <div className="text-gray-400 text-sm">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Camera */}
      <section
        id="section-3"
        className="relative z-10 flex items-center min-h-screen"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 grid lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block" />
          <div className="lg:pr-8">
            <span className="text-xs font-semibold bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
              Pro Camera System
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              Shoot like<br />a pro.
            </h2>
            <p className="text-gray-400 mb-6 max-w-sm">
              48MP main, 48MP ultra-wide, and 12MP 5x telephoto. The most powerful
              camera system ever on an iPhone.
            </p>
            <div className="flex gap-8">
              {[
                { label: '48MP', sub: 'Main' },
                { label: '48MP', sub: 'Ultra Wide' },
                { label: '12MP', sub: '5x Tele' },
              ].map((s) => (
                <div key={s.sub}>
                  <div className="text-xl font-bold text-white">{s.label}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section
        id="section-4"
        className="relative z-10 flex items-center justify-center min-h-screen"
        style={{ background: 'transparent' }}
      >
        <div className="text-center max-w-xl px-6">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Ready to experience it?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Shop the full collection and find your perfect device.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <NavLink
              to="/shop"
              className="bg-blue-500 text-white font-semibold rounded-full px-10 py-4 hover:bg-blue-600 transition-colors text-lg"
              style={{ boxShadow: '0 0 40px #3b82f660' }}
            >
              Browse Shop
            </NavLink>
            <NavLink
              to="/cart"
              className="border border-white/30 text-white font-semibold rounded-full px-10 py-4 hover:bg-white/10 transition-colors text-lg"
            >
              View Cart
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}
