import { useRef, useEffect, useState } from 'react';

const allPosts = [
  {
    title: 'iPhone 15 Pro Max vs Samsung S24 Ultra: Which One Wins in 2026?',
    excerpt: 'Two flagship titans go head-to-head. We put both cameras, chips, and displays through two weeks of real-world testing.',
    author: 'Sarah Chen',
    date: 'Sep 1, 2026',
    read: '8 min read',
    tag: 'Phones',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    featured: true,
  },
  {
    title: 'M3 Max MacBook Pro Review: The Laptop That Replaced My Desktop',
    excerpt: 'After a month with the 16" M3 Max, our editor explains why this is the most capable laptop Apple has ever made.',
    author: 'Tom Eriksson',
    date: 'Aug 22, 2026',
    read: '10 min read',
    tag: 'Laptops',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    featured: false,
  },
  {
    title: 'Sony WH-1000XM5 vs AirPods Max: The Best Noise-Cancelling Headphones in 2026',
    excerpt: 'Two industry leaders, two very different philosophies. Here is our definitive comparison after 6 weeks of daily use.',
    author: 'Priya Patel',
    date: 'Aug 10, 2026',
    read: '7 min read',
    tag: 'Audio',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    featured: false,
  },
  {
    title: 'How to Choose the Right Laptop for College (2026 Guide)',
    excerpt: 'MacBook, Windows, or something else? We break down every option for every type of student and budget.',
    author: 'Marcus Johnson',
    date: 'Jul 28, 2026',
    read: '6 min read',
    tag: 'Guide',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    featured: false,
  },
  {
    title: 'Google Pixel 9 Pro XL Review: The AI Phone That Actually Delivers',
    excerpt: "Google's AI-first approach finally feels practical. Here's everything the Pixel 9 Pro XL does better than the competition.",
    author: 'Sarah Chen',
    date: 'Jul 14, 2026',
    read: '9 min read',
    tag: 'Phones',
    img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    featured: false,
  },
  {
    title: 'iPad Pro M4 Review: Is the Magic Keyboard Worth $350?',
    excerpt: 'The iPad Pro M4 is a beast. But is the accessories ecosystem complete enough to replace your laptop? We tested it for 30 days.',
    author: 'Tom Eriksson',
    date: 'Jun 30, 2026',
    read: '11 min read',
    tag: 'Tablets',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    featured: false,
  },
];

const categories = ['All', 'Phones', 'Laptops', 'Audio', 'Tablets', 'Guide'];

// Pre-computed particle data — no Math.random during render
const BLOG_PARTICLES = Array.from({ length: 15 }, () => ({
  size: Math.random() * 3 + 1,
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

function TagBadge({ tag }) {
  const colors = {
    Phones: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-300' },
    Laptops: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-300' },
    Audio: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-300' },
    Tablets: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-300' },
    Guide: { bg: 'bg-pink-500/20', border: 'border-pink-500/30', text: 'text-pink-300' },
  };
  const c = colors[tag] || { bg: 'bg-white/10', border: 'border-white/20', text: 'text-white' };
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
      {tag}
    </span>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const featuredPost = allPosts.find((p) => p.featured);
  const regularPosts = allPosts.filter((p) => !p.featured);

  const filteredPosts =
    activeCategory === 'All' ? regularPosts : regularPosts.filter((p) => p.tag === activeCategory);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Royal blue gradient background matching Home */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, #234e8f 0%, #1a3870 40%, #122550 100%)' }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {BLOG_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: 'rgba(59,130,246,0.25)',
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
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.25; }
          33% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          66% { transform: translateY(10px) translateX(-10px); opacity: 0.35; }
        }
      `}</style>

      {/* Hero / Featured Post */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div className="mb-8 text-center">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-4 px-5 py-2 rounded-full border border-blue-400/20 bg-blue-400/10 backdrop-blur-sm">
                {String.fromCodePoint(0x1f4da)} Featured
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                TechZone{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Blog.
                </span>
              </h1>
              <p className="text-blue-200/70 text-lg max-w-xl mx-auto">
                Reviews, comparisons, and guides — written by people who actually use this stuff every day.
              </p>
            </div>
          </FadeIn>

          {/* Featured article */}
          {featuredPost && (
            <FadeIn delay={100}>
              <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden aspect-video md:aspect-auto">
                    <img
                      src={featuredPost.img}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 md:block hidden" />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <TagBadge tag={featuredPost.tag} />
                      <span className="text-blue-200/50 text-xs">{featuredPost.read}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-blue-300 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-blue-200/60 text-sm leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {featuredPost.author.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{featuredPost.author}</p>
                          <p className="text-blue-200/50 text-xs">{featuredPost.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:gap-3 transition-all">
                      Read Full Review
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'border border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-white/5 backdrop-blur-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => (
              <FadeIn key={post.title} delay={i * 80}>
                <article className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 left-3">
                      <TagBadge tag={post.tag} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-200/50 text-xs">{post.read}</span>
                      <span className="text-blue-200/30 text-xs">·</span>
                      <span className="text-blue-200/50 text-xs">{post.date}</span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-2 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-blue-200/50 text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {post.author.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-blue-200/60 text-xs font-medium">{post.author}</span>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-blue-200/50 text-lg">No posts in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-6 pb-32">
        <FadeIn delay={0}>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{ background: 'radial-gradient(circle at 50% 0%, #8b5cf6, transparent 60%)' }} />
            <div className="relative">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-300 mb-4 px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-400/10">
                Stay Updated
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Get the latest tech reviews.
              </h2>
              <p className="text-blue-200/60 text-base mb-8 max-w-md mx-auto">
                Join 25,000+ readers who get our best reviews, guides, and deals delivered weekly.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-blue-200/40 text-sm focus:outline-none focus:border-blue-400 transition-colors backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="bg-white text-gray-900 font-semibold rounded-full px-8 py-3 text-sm hover:bg-gray-100 transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-blue-200/30 text-xs mt-4">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
