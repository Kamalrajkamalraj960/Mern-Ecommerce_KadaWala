import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { FiShoppingBag, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const { _id, title, price, discountPrice, category, images, slug, stock, ratings } = product;

  // Calculate discount percentage
  const discountPercent =
    discountPrice > 0 && price > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Stop navigating to detail page on card click
    if (stock < 1) {
      showToast('Product is currently out of stock', 'error');
      return;
    }
    // Add to cart with default options (empty size/color or first items if exist)
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    
    addToCart(product, 1, defaultSize, defaultColor);
    showToast(`Added ${title} to cart successfully!`);
  };

  const finalPrice = discountPrice > 0 ? discountPrice : price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded bg-white shadow-premium hover:shadow-premium-hover transition-all duration-300 border border-gray-100"
    >
      {/* Product Image and Badges */}
      <Link to={`/products/${slug || _id}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-brand-cream">
        <img
          src={images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-4 left-4 z-10 bg-brand-gold-500 text-brand-charcoal text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
            Save {discountPercent}%
          </span>
        )}

        {/* Out of Stock Overlay */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-brand-charcoal/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-brand-charcoal text-brand-cream text-xs font-bold uppercase tracking-widest px-3 py-1.5 border border-brand-gold-500">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-500 block mb-1">
            {category}
          </span>
          <Link to={`/products/${slug || _id}`} className="hover:text-brand-green-500 transition-colors">
            <h3 className="font-playfair text-base font-bold tracking-wide text-brand-charcoal line-clamp-1 mb-2">
              {title}
            </h3>
          </Link>
          
          {/* Star Ratings */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(ratings) ? 'text-brand-gold-500 fill-brand-gold-500' : 'text-gray-200'
                }`}
              />
            ))}
            <span className="text-[10px] font-bold text-brand-charcoal/50 ml-1">
              ({ratings.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Pricing and Cart Action */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
          <div className="flex items-baseline gap-2">
            {discountPrice > 0 ? (
              <>
                <span className="font-sans text-lg font-bold text-brand-green-500">
                  ₹{discountPrice}
                </span>
                <span className="font-sans text-xs text-brand-charcoal/40 line-through">
                  ₹{price}
                </span>
              </>
            ) : (
              <span className="font-sans text-lg font-bold text-brand-charcoal">
                ₹{price}
              </span>
            )}
          </div>

          {stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded bg-brand-green-500 hover:bg-brand-gold-500 hover:text-brand-charcoal text-white transition-all shadow-md hover:scale-105 active:scale-95"
              aria-label="Add to cart"
            >
              <FiShoppingBag className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
