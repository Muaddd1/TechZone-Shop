import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <button onClick={() => navigate('/shop')} className="bg-black text-white px-6 py-3 rounded-full font-semibold">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-20 py-10 md:py-14 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-black mb-8 flex items-center gap-1 transition-colors">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Images */}
        <div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4">
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-80 md:h-[28rem] object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.badge && (
            <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {product.badge}
            </span>
          )}
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{product.category}</p>
          <h1 className="text-2xl md:text-4xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} />
            <span className="font-semibold text-sm">{product.rating}</span>
            <span className="text-gray-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 line-through text-xl">${product.originalPrice}</span>
                <span className="text-red-500 font-semibold text-sm">
                  Save ${product.originalPrice - product.price}
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-full font-semibold text-sm transition-all duration-200 mb-4 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 shadow-xl shadow-black/20'
            }`}
          >
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>

          <button
            onClick={() => { addItem(product); navigate('/cart'); }}
            className="w-full py-4 rounded-full font-semibold text-sm border-2 border-gray-300 hover:border-black transition-colors"
          >
            Buy Now
          </button>

          {/* Specs */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold mb-4">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
