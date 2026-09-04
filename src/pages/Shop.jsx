import { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { products, categories } from '../data/products';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Pre-computed particle data — no Math.random during render
const SHOP_PARTICLES = Array.from({ length: 12 }, () => ({
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
      { threshold: 0.05 }
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
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function ProductCard({ product, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <NavLink to={`/product/${product.id}`} className="group block">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
          {/* Image */}
          <div className="relative overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.badge && (
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm"
                  style={{
                    background: product.badge === 'Best Seller' ? '#3b82f680'
                      : product.badge === 'Hot Deal' ? '#ef444480'
                      : product.badge === 'Top Rated' ? '#22c55e80'
                      : product.badge === 'Save $200' || product.badge === 'Save $100' ? '#f9731680'
                      : '#8b5cf680',
                  }}
                >
                  {product.badge}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-500/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            {/* Quick view */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="block w-full text-center bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold py-2 rounded-full">
                View Details
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-blue-200/50 uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-semibold text-white text-sm leading-tight mb-2 group-hover:text-blue-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={product.rating} />
              <span className="text-blue-200/40 text-xs">{product.rating}</span>
              <span className="text-blue-200/30 text-xs">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">${product.price}</span>
              {product.originalPrice && (
                <span className="text-blue-200/40 line-through text-sm">${product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </NavLink>
    </FadeIn>
  );
}

function HeroCarousel({ products }) {
  const [current, setCurrent] = useState(0);
  const featured = products.filter((p) => [1, 3, 5, 7].includes(p.id));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const p = featured[current];
  if (!p) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md mb-10">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-square md:aspect-auto">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-300 mb-4 px-3 py-1 rounded-full border border-blue-400/30 bg-blue-400/10 w-fit">
            Featured
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">{p.name}</h2>
          <p className="text-blue-200/60 text-sm mb-4 line-clamp-2 max-w-sm">{p.description}</p>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-white">${p.price}</span>
            {p.originalPrice && (
              <span className="text-blue-200/40 line-through text-lg">${p.originalPrice}</span>
            )}
            <span className="flex items-center gap-1 text-yellow-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {p.rating} ({p.reviews.toLocaleString()})
            </span>
          </div>
          <div className="flex gap-3">
            <NavLink
              to={`/product/${p.id}`}
              className="bg-white text-gray-900 font-semibold rounded-full px-7 py-3 hover:bg-gray-100 transition-all text-sm"
            >
              Shop Now
            </NavLink>
            <button
              onClick={() => setCurrent((c) => (c + 1) % featured.length)}
              className="border border-white/20 text-white font-medium rounded-full px-5 py-3 hover:bg-white/10 transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [showDeals, setShowDeals] = useState(false);

  const filtered = products
    .filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchDeals = !showDeals || p.originalPrice !== null;
      return matchCat && matchSearch && matchDeals;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Royal blue gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, #234e8f 0%, #1a3870 40%, #122550 100%)' }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {SHOP_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`, height: `${p.size}px`,
              background: 'rgba(59,130,246,0.2)', left: `${p.left}%`, top: `${p.top}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          33% { transform: translateY(-20px) translateX(10px); opacity: 0.4; }
          66% { transform: translateY(10px) translateX(-10px); opacity: 0.3; }
        }
      `}</style>

      {/* Hero */}
      <section className="relative pt-28 pb-6 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0}>
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
                TechZone{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Shop.
                </span>
              </h1>
              <p className="text-blue-200/60 text-lg max-w-xl mx-auto">
                The latest phones, laptops, and accessories — all in one place, all at the best prices.
              </p>
            </div>
          </FadeIn>

          {/* Featured carousel */}
          <HeroCarousel products={products} />
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0}>
            <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-white text-gray-900 shadow-lg shadow-white/10'
                        : 'border border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-white/5 backdrop-blur-sm'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort + Search */}
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => setShowDeals((d) => !d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    showDeals
                      ? 'bg-red-500/20 border-red-500/40 text-red-300'
                      : 'border-white/20 text-white/60 hover:text-white hover:border-white/40 bg-white/5 backdrop-blur-sm'
                  }`}
                >
                  {String.fromCodePoint(0x1f525)} Deals
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-full px-4 py-2 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:border-blue-400 transition-colors w-44"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm focus:outline-none focus:border-blue-400 transition-colors appearance-none cursor-pointer"
                >
                  <option value="default" className="bg-gray-900">Default</option>
                  <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
                  <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
                  <option value="rating" className="bg-gray-900">Top Rated</option>
                </select>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Product Count */}
      <section className="px-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-200/40 text-sm">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'all' && ` in ${activeCategory}`}
            {showDeals && ' on sale'}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">{String.fromCodePoint(0x1f50d)}</div>
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-blue-200/50 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearch(''); setShowDeals(false); }}
                className="bg-white text-gray-900 font-semibold rounded-full px-8 py-3 hover:bg-gray-100 transition-all text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 50} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-32">
        <FadeIn delay={0}>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{ background: 'radial-gradient(circle at 50% 0%, #8b5cf6, transparent 60%)' }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Can't decide?
              </h2>
              <p className="text-blue-200/60 text-base mb-8 max-w-md mx-auto">
                Browse our blog for in-depth reviews, comparisons, and buying guides from our team.
              </p>
              <NavLink
                to="/blog"
                className="bg-white text-gray-900 font-semibold rounded-full px-10 py-4 hover:bg-gray-100 transition-all text-sm"
              >
                Read Reviews
              </NavLink>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
