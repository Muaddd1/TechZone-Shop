import { useState, useRef, useEffect, useCallback } from 'react';

const phones = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    tagline: 'Titanium. Pro.',
    color: '#1a1a1a',
    glow: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=90',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    tagline: 'Galaxy AI. Now.',
    color: '#1a1a1a',
    glow: '#a855f7',
    img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=90',
  },
  {
    id: 8,
    name: 'Google Pixel 8 Pro',
    tagline: 'The best camera. Obviously.',
    color: '#1a1a1a',
    glow: '#22c55e',
    img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=90',
  },
];

const CAROUSEL_ROTATION = 360 / phones.length; // 120deg each

export default function PhoneCarousel() {
  const [active, setActive] = useState(0);
  const [angle, setAngle] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const autoRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-rotate
  const startAuto = useCallback(() => {
    autoRef.current = setInterval(() => {
      setAngle((a) => a + CAROUSEL_ROTATION);
      setActive((a) => (a + 1) % phones.length);
    }, 3200);
  }, []);

  const stopAuto = useCallback(() => {
    clearInterval(autoRef.current);
  }, []);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto, stopAuto]);

  // Mouse move — subtle 3D tilt
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  }, []);

  // Pause auto on hover
  const handleMouseEnter = () => {
    stopAuto();
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    startAuto();
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  const current = phones[active];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
      style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Scene */}
      <div
        className="relative w-64 h-80 md:w-72 md:h-96"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${tilt.x}deg)
            rotateY(${tilt.y}deg)
            ${isHovering ? 'scale(1.02)' : 'scale(1)'}
          `,
          transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        }}
      >
        {/* Glow behind */}
        <div
          className="absolute inset-0 rounded-3xl blur-3xl opacity-40"
          style={{
            background: `radial-gradient(ellipse at center, ${current.glow}80, transparent 70%)`,
            transform: 'translateZ(-40px) scale(1.3)',
          }}
        />

        {/* Ring track */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(75deg) translateZ(0px)',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.05) 60deg, transparent 120deg)',
          }}
        />

        {/* 3D Phone Cards */}
        {phones.map((phone, i) => {
          const baseAngle = i * CAROUSEL_ROTATION;
          const relativeAngle = ((baseAngle - angle) % 360 + 360) % 360;
          const isActive = i === active;

          // Position on a cylinder: each card is 120deg apart
          const rad = ((baseAngle - angle) * Math.PI) / 180;
          const radius = 200;
          const translateX = Math.sin(rad) * radius;
          const translateZ = Math.cos(rad) * radius - radius;
          const scale = isActive ? 1.08 : 0.78;
          const opacity = isActive ? 1 : 0.45;
          const zIndex = isActive ? 10 : 1;

          return (
            <div
              key={phone.id}
              className="absolute inset-0 rounded-3xl overflow-hidden cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                transform: `
                  translateX(${translateX}px)
                  translateZ(${translateZ}px)
                  rotateY(${-rad * (180 / Math.PI)}deg)
                  scale(${scale})
                `,
                opacity,
                zIndex,
                transition: 'opacity 0.4s ease',
                backfaceVisibility: 'hidden',
              }}
              onClick={() => {
                if (!isActive) {
                  const delta = relativeAngle > 180 ? -CAROUSEL_ROTATION : CAROUSEL_ROTATION;
                  setAngle((a) => a + delta);
                  setActive(i);
                }
              }}
            >
              <img
                src={phone.img}
                alt={phone.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
            </div>
          );
        })}

        {/* Center active phone — floating info card */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
          style={{ transform: 'translateX(-50%) translateZ(80px)' }}
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 text-center">
            <p className="text-white/60 text-xs mb-0.5">{current.name}</p>
            <p className="text-white font-bold text-sm">{current.tagline}</p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {phones.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              stopAuto();
              const delta = ((i - active + phones.length) % phones.length) * CAROUSEL_ROTATION;
              setAngle((a) => a + delta);
              setActive(i);
              startAuto();
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
            }`}
            aria-label={`View ${p.name}`}
          />
        ))}
      </div>

      {/* Floating HUD labels */}
      <FloatingHUD phone={current} tilt={tilt} />
    </div>
  );
}

function FloatingHUD({ tilt }) {
  const items = [
    { label: '5G', icon: '⚡', x: '10%', y: '20%' },
    { label: '48MP', icon: '📷', x: '80%', y: '15%' },
    { label: '120Hz', icon: '🖥', x: '85%', y: '75%' },
    { label: 'AI Chip', icon: '🤖', x: '5%', y: '70%' },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `rotateX(${tilt.x * 0.3}deg) rotateY(${tilt.y * 0.3}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="absolute flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white text-xs font-medium"
          style={{
            left: item.x,
            top: item.y,
            transform: 'translateZ(60px)',
          }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
