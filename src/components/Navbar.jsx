import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const searchRef = useRef(null);

  // Handle scroll — add glass background when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const navBg = scrolled
    ? 'bg-white/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5'
    : 'bg-white border-b border-transparent';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <span className="text-white text-xs font-black">Z</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">TechZone</span>
            </NavLink>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Search"
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                <Search size={18} />
              </button>

              {/* Login — desktop only */}
              <NavLink
                to="/login"
                className="hidden md:flex items-center border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-900 transition-all duration-200"
              >
                Login
              </NavLink>

              {/* Cart */}
              <NavLink
                to="/cart"
                className="relative w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              >
                <ShoppingCart size={17} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </NavLink>

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Search bar — slides down */}
          <div
            className="overflow-hidden transition-all duration-400 ease-out"
            style={{
              maxHeight: searchOpen ? '80px' : '0px',
              opacity: searchOpen ? 1 : 0,
            }}
          >
            <div className="pb-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="relative"
              >
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for phones, laptops, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 rounded-full pl-11 pr-5 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm opacity-0 animate-[fadeIn_0.2s_ease_forwards]"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transition-transform duration-500 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">Z</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">TechZone</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer nav */}
        <div className="px-4 pt-4 pb-2">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Drawer footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-gray-100 bg-white">
          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-full px-5 py-3 text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all mb-3"
          >
            Login
          </NavLink>
          <NavLink
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white rounded-full px-5 py-3 text-sm font-semibold hover:bg-gray-800 transition-all"
          >
            <ShoppingCart size={16} />
            Cart {totalItems > 0 && `(${totalItems})`}
          </NavLink>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
