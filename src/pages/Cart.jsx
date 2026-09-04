import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { NavLink } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, subtotal, tax, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some products to get started.</p>
          <NavLink
            to="/shop"
            className="bg-black text-white rounded-full px-8 py-4 font-semibold hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-20 py-10 md:py-14 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

      <div className="grid md:grid-cols-[1fr_22rem] gap-10">
        {/* Items */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-gray-50 rounded-2xl p-4">
              <button
                onClick={() => navigate(`/product/${item.id}`)}
                className="flex-shrink-0 w-24 h-24 bg-white rounded-xl overflow-hidden"
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </button>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="font-semibold text-sm hover:text-blue-600 transition-colors text-left truncate block w-full"
                >
                  {item.name}
                </button>
                <p className="text-gray-400 text-xs mt-0.5">{item.category}</p>
                <div className="flex items-center justify-between mt-3">
                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.price * item.qty).toLocaleString()}</p>
                    {item.qty > 1 && (
                      <p className="text-gray-400 text-xs">${item.price} each</p>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="self-start text-gray-400 hover:text-red-500 transition-colors text-xs font-bold"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => alert('Checkout coming soon!')}
            className="w-full mt-6 bg-black text-white rounded-full py-4 font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="w-full mt-3 text-center text-sm text-gray-500 hover:text-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
