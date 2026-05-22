import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { FiStar, FiShoppingBag, FiArrowLeft, FiTruck, FiInfo, FiAward } from 'react-icons/fi';

const ProductDetails = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  // Custom option selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${idOrSlug}`);
        setProduct(data.data);
        setActiveImage(data.data.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600');
        
        // Setup initial default option selections
        if (data.data.sizes && data.data.sizes.length > 0) {
          setSelectedSize(data.data.sizes[0]);
        }
        if (data.data.colors && data.data.colors.length > 0) {
          setSelectedColor(data.data.colors[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load product details', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [idOrSlug]);

  const handleQtyChange = (val) => {
    if (!product) return;
    const newQty = qty + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQty(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock < 1) {
      showToast('Item is out of stock', 'error');
      return;
    }

    addToCart(product, qty, selectedSize, selectedColor);
    showToast(`Added ${qty} x ${product.title} to cart successfully!`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-gray-200 aspect-square rounded w-full" />
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FiInfo className="h-12 w-12 text-brand-gold-500 mx-auto mb-4" />
        <h2 className="font-playfair text-2xl font-bold text-brand-charcoal mb-2">Product Not Found</h2>
        <p className="font-sans text-sm font-light text-gray-500 mb-6">
          The product you are trying to view does not exist or has been removed from our catalog.
        </p>
        <Link
          to="/shop"
          className="bg-brand-green-500 hover:bg-brand-charcoal text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-widest transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.discountPrice > 0 && product.price > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-charcoal/70 hover:text-brand-green-500 transition-colors mb-8 focus:outline-none"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white p-6 sm:p-10 rounded border border-gray-100 shadow-premium">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] w-full overflow-hidden rounded bg-brand-cream border border-gray-50">
            <img
              src={activeImage}
              alt={product.title}
              className="h-full w-full object-cover object-center transition-transform duration-500"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded border-2 transition-all ${
                    activeImage === img ? 'border-brand-green-500 scale-95 shadow' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information Panel */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-500 block mb-1">
              {product.brand} • {product.category}
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide text-brand-charcoal mt-1">
              {product.title}
            </h1>
            
            {/* Ratings */}
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.ratings) ? 'text-brand-gold-500 fill-brand-gold-500' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-charcoal/50">
                ({product.ratings.toFixed(1)} / 5.0 rating)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3.5 border-y border-gray-100 py-4">
            {product.discountPrice > 0 ? (
              <>
                <span className="font-sans text-2xl font-bold text-brand-green-500">
                  ${product.discountPrice}
                </span>
                <span className="font-sans text-sm text-brand-charcoal/40 line-through">
                  ${product.price}
                </span>
                <span className="text-[10px] bg-brand-gold-100 text-brand-gold-900 font-bold uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm">
                  Save {discountPercent}%
                </span>
              </>
            ) : (
              <span className="font-sans text-2xl font-bold text-brand-charcoal">
                ${product.price}
              </span>
            )}
          </div>

          {/* Product Description */}
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-2">Description</h3>
            <p className="font-sans text-sm font-light text-gray-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-2">Select Size</h3>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`border px-4 py-2 text-xs font-semibold tracking-wider rounded uppercase transition-colors focus:outline-none ${
                      selectedSize === sz
                        ? 'border-brand-green-500 bg-brand-green-500 text-white shadow-sm'
                        : 'border-gray-200 text-brand-charcoal/70 hover:border-brand-green-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-2">Select Color</h3>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`border px-4 py-2 text-xs font-semibold tracking-wider rounded uppercase transition-colors focus:outline-none ${
                      selectedColor === col
                        ? 'border-brand-green-500 bg-brand-green-500 text-white shadow-sm'
                        : 'border-gray-200 text-brand-charcoal/70 hover:border-brand-green-500'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Quantity Control */}
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-2">Quantity</h3>
            {product.stock > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="px-3.5 py-2 hover:bg-gray-50 text-gray-500 font-bold transition-colors focus:outline-none"
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold select-none">{qty}</span>
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="px-3.5 py-2 hover:bg-gray-50 text-gray-500 font-bold transition-colors focus:outline-none"
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {product.stock} items available in stock
                </span>
              </div>
            ) : (
              <span className="inline-block text-xs font-bold text-red-500 bg-red-50 py-1.5 px-3 border border-red-200 rounded uppercase tracking-wider">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-gray-100 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-grow flex items-center justify-center gap-2 bg-brand-green-500 hover:bg-brand-charcoal text-white font-bold py-4 px-6 rounded transition-colors uppercase tracking-widest text-xs shadow-md ${
                product.stock <= 0 ? 'bg-gray-200 hover:bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border border-gray-200' : ''
              }`}
            >
              <FiShoppingBag className="h-4.5 w-4.5" />
              {product.stock > 0 ? 'Add to Shopping Bag' : 'Out of Stock'}
            </button>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-4 border-t border-gray-100 text-xs text-gray-500 font-light leading-relaxed">
            <div className="flex items-center gap-3">
              <FiTruck className="h-5 w-5 text-brand-gold-500 shrink-0" />
              <span>Complimentary insured shipping over $150</span>
            </div>
            <div className="flex items-center gap-3">
              <FiAward className="h-5 w-5 text-brand-gold-500 shrink-0" />
              <span>Artisan verified GI tag heritage craft</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
