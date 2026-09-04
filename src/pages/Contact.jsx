import { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const contactInfo = [
  {
    label: 'Email',
    value: 'support@techzone.app',
    sub: 'We reply within 24 hours',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    color: '#3b82f6',
  },
  {
    label: 'Phone',
    value: '+1 (555) 123-4567',
    sub: 'Mon–Fri, 9am–6pm PST',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    color: '#8b5cf6',
  },
  {
    label: 'Office',
    value: '123 Market St',
    sub: 'San Francisco, CA 94103',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    color: '#22c55e',
  },
  {
    label: 'Hours',
    value: 'Mon–Fri, 9am–6pm',
    sub: 'Sat 10am–4pm PST',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#f97316',
  },
];

const faqItems = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3–5 business days. Express (1–2 days) is available at checkout.' },
  { q: 'Do you offer international shipping?', a: 'Yes! We ship to over 40 countries. International orders typically arrive in 7–14 business days.' },
  { q: 'What is your return policy?', a: "30 days, no questions asked. Just contact us for a return label and we'll refund you immediately." },
  { q: 'Are your products authentic?', a: 'Every product is 100% genuine. We source directly from manufacturers and authorized distributors.' },
];

// Pre-computed particle data — no Math.random during render
const CONTACT_PARTICLES = Array.from({ length: 15 }, () => ({
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
  pulseDelay: Math.random() * 3,
  pulseDuration: Math.random() * 3 + 2,
}));
const CONTACT_SENT_PARTICLES = Array.from({ length: 12 }, () => ({
  size: Math.random() * 4 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  pulseDelay: Math.random() * 3,
  pulseDuration: Math.random() * 3 + 2,
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
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AccordionItem({ q, a, isOpen, onClick }) {
  return (
    <div
      className={`rounded-xl border transition-all cursor-pointer overflow-hidden ${
        isOpen
          ? 'border-blue-400/40 bg-white/10'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-5">
        <h3 className="font-semibold text-white text-sm pr-4">{q}</h3>
        <div className={`w-5 h-5 rounded-full border border-white/30 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '200px' : '0px' }}
      >
        <p className="px-5 pb-5 text-blue-200/60 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact:', form);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <div
          className="fixed inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, #234e8f 0%, #1a3870 40%, #122550 100%)' }}
        />
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {CONTACT_SENT_PARTICLES.map((p, i) => (
            <div key={i} className="absolute rounded-full animate-pulse"
              style={{
                width: `${p.size}px`, height: `${p.size}px`,
                background: 'rgba(59,130,246,0.3)', left: `${p.left}%`, top: `${p.top}%`,
                animationDelay: `${p.pulseDelay}s`, animationDuration: `${p.pulseDuration}s`,
              }}
            />
          ))}
        </div>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <FadeIn delay={0}>
            <div className="w-20 h-20 rounded-full border-2 border-green-400 flex items-center justify-center mb-6 animate-pulse"
              style={{ boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}>
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Message received!
            </h1>
            <p className="text-blue-200/70 text-lg mb-8 max-w-md">
              We'll get back to you within 24 hours. Keep an eye on your inbox.
            </p>
            <NavLink
              to="/"
              className="bg-white text-gray-900 font-semibold rounded-full px-8 py-4 hover:bg-gray-100 transition-all"
            >
              Back to Home
            </NavLink>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Royal blue gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, #234e8f 0%, #1a3870 40%, #122550 100%)' }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {CONTACT_PARTICLES.map((p, i) => (
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

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center">
        <FadeIn delay={0}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-6 px-5 py-2 rounded-full border border-blue-400/20 bg-blue-400/10 backdrop-blur-sm">
            {String.fromCodePoint(0x2709)} Get in Touch
          </span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            We'd love to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              hear from you.
            </span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="text-blue-200/70 text-lg max-w-xl mx-auto">
            Questions about a product, your order, or returns? We're here to help — usually within minutes.
          </p>
        </FadeIn>
      </section>

      {/* Contact Cards */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/10"
                    style={{ background: `${info.color}20`, color: info.color }}
                  >
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{info.label}</h3>
                  <p className="text-white/80 text-sm font-medium">{info.value}</p>
                  <p className="text-blue-200/50 text-xs mt-0.5">{info.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <FadeIn delay={0} className="lg:col-span-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10">
                <h2 className="text-2xl font-bold text-white mb-2">Send a message</h2>
                <p className="text-blue-200/50 text-sm mb-8">Fill out the form and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-blue-200/70 block mb-2 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Sarah Chen"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-blue-200/70 block mb-2 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="sarah@example.com"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-200/70 block mb-2 uppercase tracking-wider">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-gray-900">Select a topic</option>
                      <option value="order" className="bg-gray-900">Order Inquiry</option>
                      <option value="product" className="bg-gray-900">Product Question</option>
                      <option value="returns" className="bg-gray-900">Returns & Refunds</option>
                      <option value="feedback" className="bg-gray-900">Feedback</option>
                      <option value="other" className="bg-gray-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-200/70 block mb-2 uppercase tracking-wider">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-gray-900 font-semibold rounded-full py-4 text-sm hover:bg-gray-100 transition-all hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer mt-2"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </FadeIn>

            {/* FAQ */}
            <FadeIn delay={100} className="lg:col-span-2">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Common questions</h2>
                <p className="text-blue-200/50 text-sm mb-6">Quick answers to what we get asked most.</p>
                <div className="flex flex-col gap-3">
                  {faqItems.map((item, i) => (
                    <AccordionItem
                      key={i}
                      q={item.q}
                      a={item.a}
                      isOpen={openFaq === i}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    />
                  ))}
                </div>

                {/* Social links */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                  <h3 className="font-semibold text-white text-sm mb-4">Follow us</h3>
                  <div className="flex gap-3">
                    {[
                      { label: 'Twitter', color: '#1da1f2', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                      { label: 'Instagram', color: '#e1306c', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                      { label: 'TikTok', color: '#ffffff', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
                    ].map(({ label, color, path }) => (
                      <a
                        key={label}
                        href="#"
                        aria-label={label}
                        className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group"
                      >
                        <svg className="w-4 h-4" style={{ fill: color }} viewBox="0 0 24 24">
                          <path d={path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
