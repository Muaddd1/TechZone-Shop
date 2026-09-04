import { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const values = [
  {
    title: 'Authentic Products',
    desc: 'Every item is 100% genuine. We source directly from manufacturers and authorized distributors.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    color: '#3b82f6',
  },
  {
    title: 'Fast Shipping',
    desc: 'Orders placed before 2pm ship same day. Free delivery on orders over $50, no matter where you are.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    color: '#8b5cf6',
  },
  {
    title: 'Best Prices',
    desc: "We monitor market prices daily to ensure you always get the best deal. Found it cheaper? We'll match it.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#22c55e',
  },
  {
    title: 'Easy Returns',
    desc: '30-day hassle-free returns. Not happy? Send it back, no questions asked — we even cover return shipping.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    color: '#f97316',
  },
];

const milestones = [
  { year: '2024', title: 'The Beginning', desc: 'TechZone launched from a small garage with a big idea: make premium tech accessible to everyone.' },
  { year: '2024', title: 'First 1,000 Customers', desc: 'We hit 1,000 happy customers in just 6 months — word spread fast because people loved the experience.' },
  { year: '2025', title: 'Expanded to Laptops', desc: 'Added laptops, tablets, and accessories. Became the one-stop shop for all things tech.' },
  { year: '2026', title: '50,000+ Customers', desc: "Today we're proud to serve over 50,000 customers across the country — and we're just getting started." },
];

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-founder', img: 'https://randomuser.me/api/portraits/women/44.jpg', color: '#3b82f6' },
  { name: 'Marcus Johnson', role: 'CTO & Co-founder', img: 'https://randomuser.me/api/portraits/men/32.jpg', color: '#8b5cf6' },
  { name: 'Priya Patel', role: 'Head of Product', img: 'https://randomuser.me/api/portraits/women/68.jpg', color: '#22c55e' },
  { name: 'Tom Eriksson', role: 'Head of Engineering', img: 'https://randomuser.me/api/portraits/men/77.jpg', color: '#f97316' },
];

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Pre-computed particle data — no Math.random during render
const ABOUT_PARTICLES = Array.from({ length: 20 }, () => ({
  width: Math.random() * 4 + 1,
  height: Math.random() * 4 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}));

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Royal blue gradient background matching Home */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, #234e8f 0%, #1a3870 40%, #122550 100%)' }}
      />

      {/* Floating particles overlay */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {ABOUT_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: 'rgba(59,130,246,0.3)',
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          33% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          66% { transform: translateY(10px) translateX(-10px); opacity: 0.4; }
        }
      `}</style>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        {/* Glow accent */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

        <FadeIn delay={0}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-6 px-5 py-2 rounded-full border border-blue-400/20 bg-blue-400/10 backdrop-blur-sm">
            {String.fromCodePoint(0x1f3db)} Our Story
          </span>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 max-w-4xl">
            We believe everyone deserves{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              great tech.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="text-blue-200/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            TechZone was founded in 2024 with one mission: make the latest phones, laptops, and accessories
            accessible to everyone — at prices that actually make sense.
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="flex flex-wrap gap-4 justify-center">
            <NavLink
              to="/shop"
              className="bg-white text-gray-900 font-semibold rounded-full px-8 py-4 hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-white/10"
            >
              Start Shopping
            </NavLink>
            <NavLink
              to="/contact"
              className="border border-white/30 text-white font-semibold rounded-full px-8 py-4 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Get in Touch
            </NavLink>
          </div>
        </FadeIn>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-blue-300/60 text-xs tracking-widest uppercase">Scroll</p>
          <div className="w-px h-10 bg-gradient-to-b from-blue-300/60 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { num: 50000, suffix: '+', label: 'Happy Customers', color: '#3b82f6' },
                { num: 12000, suffix: '+', label: 'Products Sold', color: '#8b5cf6' },
                { num: 4.8, suffix: '★', label: 'Average Rating', color: '#22c55e', isFloat: true },
                { num: 30, suffix: '-Day', label: 'Easy Returns', color: '#f97316' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-8 text-center group hover:bg-white/10 transition-all"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${s.color}15, transparent)` }}
                  />
                  <p
                    className="text-3xl md:text-4xl font-bold text-white mb-1 relative"
                    style={{ color: s.isFloat ? undefined : s.color }}
                  >
                    <Counter target={s.num} suffix={s.suffix} />
                  </p>
                  <p className="text-blue-200/70 text-sm relative">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Our Story — Timeline */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-300 mb-4 px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-400/10">
                The Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                From garage to{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  50,000 customers.
                </span>
              </h2>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-blue-500/20" />

            {milestones.map((m, i) => (
              <FadeIn key={m.year + m.title} delay={i * 120}>
                <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot on timeline */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-blue-400 bg-blue-600 shadow-lg shadow-blue-500/40 z-10 mt-6 shrink-0"
                    style={{ boxShadow: '0 0 12px #3b82f6' }} />

                  {/* Card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left md:ml-auto'}`}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 transition-all group">
                      <span className="inline-block text-xs font-bold tracking-wider text-blue-400 mb-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20">
                        {m.year}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{m.title}</h3>
                      <p className="text-blue-200/70 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-green-300 mb-4 px-4 py-1.5 rounded-full border border-green-400/20 bg-green-400/10">
                Why Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Built on{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  trust.
                </span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 100}>
                <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-7 hover:bg-white/10 transition-all hover:border-white/20 hover:-translate-y-1">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 border border-white/10"
                    style={{ background: `${v.color}20`, color: v.color }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                  <p className="text-blue-200/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-orange-300 mb-4 px-4 py-1.5 rounded-full border border-orange-400/20 bg-orange-400/10">
                The People
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Meet the{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  team.
                </span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <FadeIn key={m.name} delay={i * 100}>
                <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden hover:bg-white/10 transition-all hover:-translate-y-1">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ background: m.color, boxShadow: `0 0 12px ${m.color}` }}
                      />
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-white text-base">{m.name}</h3>
                    <p className="text-blue-200/60 text-sm mt-0.5">{m.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <FadeIn delay={0}>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{ background: 'radial-gradient(circle at 50% 0%, #3b82f6, transparent 60%)' }} />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to find your next device?
              </h2>
              <p className="text-blue-200/70 text-lg mb-10 max-w-md mx-auto">
                Browse our collection of the latest phones, laptops, and accessories — all at the best prices.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <NavLink
                  to="/shop"
                  className="bg-white text-gray-900 font-semibold rounded-full px-10 py-4 hover:bg-gray-100 transition-all hover:shadow-xl hover:shadow-blue-500/20 text-lg"
                >
                  Shop Now
                </NavLink>
                <NavLink
                  to="/contact"
                  className="border border-white/30 text-white font-semibold rounded-full px-10 py-4 hover:bg-white/10 transition-colors text-lg backdrop-blur-sm"
                >
                  Contact Us
                </NavLink>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
