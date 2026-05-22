import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import API from '../services/api.js';
import { FiTrash2, FiShoppingBag, FiMapPin, FiCreditCard } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please login to place an order', 'error');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your shopping bag is empty', 'error');
      return;
    }

    // Validate address fields
    const { street, city, state, zipCode, country } = shippingAddress;
    if (!street || !city || !state || !zipCode || !country) {
      showToast('Please complete your shipping address details', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Format product details for backend order schema
      const orderProducts = cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }));

      const { data } = await API.post('/orders', {
        products: orderProducts,
        shippingAddress,
        paymentMethod: 'COD', // Cash on Delivery default
      });

      showToast('Order placed successfully! Thank you for shopping with KadaWave.', 'success');
      clearCart();
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Checkout failed';
      showToast(errMsg, 'error');
    }
  };

  const shippingCost = cartTotal > 150 ? 0 : 15;
  const grandTotal = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FiShoppingBag className="h-16 w-16 text-brand-gold-500 mx-auto mb-6 animate-pulse" />
        <h2 className="font-playfair text-3xl font-bold text-brand-charcoal mb-3">Your Shopping Bag is Empty</h2>
        <p className="font-sans text-sm font-light text-gray-500 max-w-sm mx-auto mb-8">
          Browse our collections of traditional and contemporary Kerala designs to add items to your cart.
        </p>
        <Link
          to="/shop"
          className="bg-brand-green-500 hover:bg-brand-charcoal text-white text-xs font-bold py-4 px-8 rounded uppercase tracking-widest transition-colors shadow-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-playfair text-3xl sm:text-4xl font-black text-brand-charcoal mb-10 pb-4 border-b border-gray-200">
        Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Section: Items List (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {cartItems.map((item) => (
            <div
              key={`${item.product}-${item.selectedSize}-${item.selectedColor}`}
              className="flex items-center gap-4 bg-white p-4 rounded border border-gray-100 shadow-premium"
            >
              {/* Product Thumbnail */}
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded bg-brand-cream border border-gray-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Product Info & Controls */}
              <div className="flex-grow min-w-0">
                <Link to={`/products/${item.slug}`} className="hover:text-brand-green-500 transition-colors">
                  <h3 className="font-playfair text-base font-bold text-brand-charcoal truncate">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap gap-2 text-[10px] text-brand-gold-500 font-bold uppercase tracking-wider mt-1">
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                </div>

                {/* Quantity Buttons */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-gray-50 text-gray-500 font-bold transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-semibold select-none">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-gray-50 text-gray-500 font-bold transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    {item.stock} left
                  </span>
                </div>
              </div>

              {/* Price and Remove Button */}
              <div className="text-right shrink-0 flex flex-col items-end gap-3">
                <p className="font-sans text-base font-bold text-brand-charcoal">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product, item.selectedSize, item.selectedColor)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded"
                  aria-label="Remove item"
                >
                  <FiTrash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section: Order Checkout Summary (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Address Form */}
          <div className="bg-white p-6 rounded border border-gray-100 shadow-premium">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-4 flex items-center gap-2">
              <FiMapPin className="h-4 w-4 text-brand-gold-500" />
              Shipping Address
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  required
                  placeholder="e.g. 12/45 Heritage Lane"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                    placeholder="e.g. Kochi"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                    placeholder="e.g. Kerala"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    required
                    placeholder="e.g. 682001"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                    placeholder="e.g. India"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* 2. Breakdown and Checkout Button */}
          <div className="bg-white p-6 rounded border border-gray-100 shadow-premium space-y-4">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-4 flex items-center gap-2">
              <FiCreditCard className="h-4 w-4 text-brand-gold-500" />
              Order Summary
            </h3>

            <div className="space-y-2 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-brand-charcoal">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Fee</span>
                <span className="font-semibold text-brand-charcoal">
                  {shippingCost === 0 ? (
                    <span className="text-brand-green-500 font-bold uppercase text-[10px] tracking-wider">Free</span>
                  ) : (
                    `₹${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-brand-gold-600 font-medium">
                  Add ₹{(150 - cartTotal).toFixed(2)} more to qualify for Free Shipping.
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-bold text-brand-charcoal">Grand Total</span>
              <span className="font-sans text-xl font-bold text-brand-green-500">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-gray-400 mb-4 leading-relaxed font-light">
                * Note: Currently we only support Cash on Delivery (COD) transactions for secure shipping verification.
              </p>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-brand-green-500 hover:bg-brand-charcoal text-white font-bold py-4 rounded uppercase tracking-widest text-xs shadow-md transition-colors"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Place Order (Cash On Delivery)'
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
