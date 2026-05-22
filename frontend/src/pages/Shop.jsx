import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { FiSearch, FiSliders, FiX, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const location = useLocation();
  
  // Extract category query from URL if redirected from elsewhere
  const getCategoryFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'All';
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromUrl());
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync category state if URL query changes
  useEffect(() => {
    setSelectedCategory(getCategoryFromUrl());
  }, [location.search]);

  // Fetch unique categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/products/categories');
        setCategories(['All', ...data.data]);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let queryStr = `?sort=${sortBy}`;
      
      if (selectedCategory && selectedCategory !== 'All') {
        queryStr += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery) {
        queryStr += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (minPrice) {
        queryStr += `&minPrice=${minPrice}`;
      }
      if (maxPrice) {
        queryStr += `&maxPrice=${maxPrice}`;
      }

      const { data } = await API.get(`/products${queryStr}`);
      setProducts(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load products', err);
      setLoading(false);
    }
  };

  // Trigger fetch when parameters modify
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('latest');
    // Fetch will trigger automatically due to selectedCategory / sortBy state modifications
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Shop Header */}
      <div className="border-b border-gray-200 pb-5 mb-10 flex flex-col md:flex-row md:items-baseline md:justify-between">
        <div>
          <h1 className="font-playfair text-4xl font-black text-brand-charcoal">The Catalog</h1>
          <p className="text-xs font-semibold text-brand-gold-500 uppercase tracking-widest mt-1">
            Browse through Kerala's finest artisanal goods
          </p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4 md:mt-0 relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded py-2.5 pl-4 pr-10 text-sm font-sans focus:outline-none focus:border-brand-green-500 transition-colors"
          />
          <button type="submit" className="absolute right-3 top-3 text-gray-400 hover:text-brand-green-500 transition-colors">
            <FiSearch className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

      {/* Mobile Filters Trigger */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 border border-gray-200 bg-white py-2 px-4 rounded text-sm font-bold text-brand-charcoal"
        >
          <FiSliders className="h-4 w-4" /> Filters
        </button>
        
        {/* Quick Sort mobile */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-200 rounded py-2 px-3 text-sm font-semibold"
        >
          <option value="latest">Latest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="ratings">Ratings</option>
        </select>
      </div>

      <div className="flex gap-8 items-start">
        
        {/* 2. Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 border border-gray-100 bg-white p-6 rounded shadow-premium">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-brand-charcoal">Filters</h3>
            <button onClick={handleResetFilters} className="text-xs font-semibold text-brand-gold-500 hover:text-brand-green-500 transition-colors">
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-4">Categories</h4>
            <div className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'text-brand-green-500 font-bold'
                      : 'text-brand-charcoal/60 hover:text-brand-green-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-4">Price Range</h4>
            <form onSubmit={handleApplyPriceFilter} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-center"
                />
                <span className="text-gray-400 font-light">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-center"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-green-500 hover:bg-brand-charcoal text-white text-xs font-bold py-2 rounded transition-colors uppercase tracking-widest"
              >
                Apply Range
              </button>
            </form>
          </div>

          {/* Sort selection */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-4">Sort By</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { name: 'Latest Arrivals', value: 'latest' },
                { name: 'Price: Low to High', value: 'priceAsc' },
                { name: 'Price: High to Low', value: 'priceDesc' },
                { name: 'Highest Rated', value: 'ratings' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`text-left text-sm font-medium transition-colors ${
                    sortBy === opt.value
                      ? 'text-brand-green-500 font-bold'
                      : 'text-brand-charcoal/60 hover:text-brand-green-500'
                  }`}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 3. Product Catalog Grid */}
        <div className="flex-grow">
          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-200 aspect-[4/5] rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State Screen */
            <div className="text-center py-24 bg-white border border-gray-100 rounded shadow-premium flex flex-col items-center justify-center p-6">
              <FiInfo className="h-12 w-12 text-brand-gold-500 mb-4 animate-bounce" />
              <h3 className="font-playfair text-2xl font-bold text-brand-charcoal mb-2">No Products Found</h3>
              <p className="font-sans text-sm font-light text-gray-500 max-w-sm mb-6">
                We couldn't find any products matching your active filters. Try resetting them.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-brand-green-500 hover:bg-brand-gold-500 hover:text-brand-charcoal text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-widest transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Product Catalog Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Mobile Drawer Filters (using Framer Motion) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black md:hidden"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-brand-cream p-6 shadow-premium overflow-y-auto flex flex-col justify-between md:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-brand-green-100 mb-6">
                  <h3 className="font-sans text-base font-bold uppercase tracking-wider text-brand-charcoal">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <FiX className="h-6 w-6 text-brand-charcoal hover:text-brand-gold-500" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-4">Categories</h4>
                  <div className="flex flex-col gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left text-sm font-medium transition-colors ${
                          selectedCategory === cat
                            ? 'text-brand-green-500 font-bold'
                            : 'text-brand-charcoal/60 hover:text-brand-green-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="mb-8">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-4">Price Range</h4>
                  <form
                    onSubmit={(e) => {
                      handleApplyPriceFilter(e);
                      setMobileFiltersOpen(false);
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-center"
                      />
                      <span className="text-gray-400 font-light">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-center"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-green-500 hover:bg-brand-charcoal text-white text-xs font-bold py-2 rounded transition-colors uppercase tracking-widest"
                    >
                      Apply Range
                    </button>
                  </form>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-green-100">
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full border border-brand-gold-500 py-3 rounded text-xs font-bold text-brand-gold-700 hover:bg-brand-gold-50 transition-colors uppercase tracking-widest text-center"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Shop;
