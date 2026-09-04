import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Pre-computed particle data — no Math.random during render
const LOGIN_PARTICLES = Array.from({ length: 12 }, () => ({
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}));

function FadeIn({ children, delay = 0 }) {
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
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Login:', form);
    setLoading(false);
    alert('Login coming soon — connect your auth provider!');
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Royal blue gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, #234e8f 0%, #1a3870 40%, #122550 100%)' }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {LOGIN_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`, height: `${p.size}px`,
              background: 'rgba(59,130,246,0.25)', left: `${p.left}%`, top: `${p.top}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.25; }
          33% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          66% { transform: translateY(10px) translateX(-10px); opacity: 0.35; }
        }
      `}</style>

      {/* Login card */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <FadeIn delay={0}>
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white font-black text-lg">Z</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">TechZone</span>
            </div>
          </FadeIn>

          {/* Card */}
          <FadeIn delay={80}>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10">
              <FadeIn delay={120}>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                  <p className="text-blue-200/50 text-sm">Sign in to your TechZone account</p>
                </div>
              </FadeIn>

              {/* Social login */}
              <FadeIn delay={160}>
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-3 transition-all hover:-translate-y-0.5"
                  >
                    <GoogleIcon /> Google
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-3 transition-all hover:-translate-y-0.5"
                  >
                    <AppleIcon /> Apple
                  </button>
                </div>
              </FadeIn>

              {/* Divider */}
              <FadeIn delay={200}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-blue-200/30 text-xs uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </FadeIn>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <FadeIn delay={240}>
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      {error}
                    </div>
                  )}
                </FadeIn>

                <FadeIn delay={280}>
                  <div>
                    <label className="text-xs font-semibold text-blue-200/60 block mb-2 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="sarah@example.com"
                      required
                    />
                  </div>
                </FadeIn>

                <FadeIn delay={320}>
                  <div>
                    <label className="text-xs font-semibold text-blue-200/60 block mb-2 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-blue-200/70 transition-colors text-xs font-medium"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={360}>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-blue-200/50 hover:text-blue-200/80 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500" />
                      <span className="text-xs">Remember me</span>
                    </label>
                    <button type="button" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </FadeIn>

                <FadeIn delay={400}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full bg-white text-gray-900 font-bold rounded-full py-4 text-sm hover:bg-gray-100 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </FadeIn>
              </form>

              <FadeIn delay={440}>
                <p className="text-center text-blue-200/40 text-sm mt-6">
                  Don't have an account?{' '}
                  <NavLink to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Sign up free
                  </NavLink>
                </p>
              </FadeIn>
            </div>
          </FadeIn>

          {/* Back to site */}
          <FadeIn delay={200}>
            <div className="text-center mt-6">
              <NavLink to="/" className="text-blue-200/30 hover:text-blue-200/60 text-sm transition-colors flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to TechZone
              </NavLink>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
