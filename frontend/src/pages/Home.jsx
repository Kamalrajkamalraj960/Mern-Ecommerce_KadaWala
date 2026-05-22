import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiHeart, FiGift } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products?featured=true');
        setFeaturedProducts(data.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Failed to load featured products', err);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    {
      name: 'Fashion',
      label: 'Ethnic Weaves',
      desc: 'Elegant Silk & Kasavu Handlooms',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      link: '/shop?category=Fashion',
    },
    {
      name: 'Home Decor',
      label: 'Heritage Brass',
      desc: 'Traditional Mirrors & Sculptures',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80',
      link: '/shop?category=Home%20Decor',
    },
    {
      name: 'Spices & Teas',
      label: 'High Range Estates',
      desc: 'Single-Origin Spices & Cardamom Teas',
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80',
      link: '/shop?category=Spices%20%26%20Teas',
    },
  ];

  return (
    <div className="bg-brand-cream overflow-hidden">
      
      {/* 1. Hero Banner Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-brand-charcoal overflow-hidden py-20 px-4">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80"
            alt="Kerala Backwaters"
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-brand-charcoal/80" />
        </div>

        {/* Hero Text Content */}
        <div className="relative z-10 max-w-5xl text-center text-white px-4">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-brand-gold-500 block mb-4"
          >
            Sourced Authentically from Kerala
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wide leading-tight mb-6"
          >
            Where Heritage Meets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-500 to-brand-gold-200">
              Modern Luxury
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-sm sm:text-lg font-light text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Immerse yourself in KadaWave's exclusive collections of handloom textiles, exquisite metalwork mirrors, and pure mountain spices.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              to="/shop"
              className="group flex items-center gap-2 bg-brand-green-500 hover:bg-brand-gold-500 hover:text-brand-charcoal text-white font-bold py-4 px-8 rounded transition-all uppercase tracking-widest text-xs shadow-gold-glow"
            >
              Explore Collection
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Brand Statement Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-brand-gold-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">Our Core Philosophy</h2>
            <p className="font-playfair text-3xl sm:text-4xl font-bold text-brand-charcoal leading-tight mb-8">
              "Kada" stands for the marketplace, "Wave" for modern tides. We are bringing the shores of Kerala to global design standards.
            </p>
            <div className="h-0.5 w-16 bg-brand-gold-500 mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
            <div className="p-6 border border-gray-50 rounded bg-gray-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-500 mx-auto mb-4">
                <FiShield className="h-6 w-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-brand-charcoal mb-2">100% GI Authentic</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Direct partnerships with state-recognized co-operatives and award-winning generational craftsmen.
              </p>
            </div>
            <div className="p-6 border border-gray-50 rounded bg-gray-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-500 mx-auto mb-4">
                <FiHeart className="h-6 w-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-brand-charcoal mb-2">Empowering Communities</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Every purchase directly funds artisan pensions and supports sustainable community weaving centers.
              </p>
            </div>
            <div className="p-6 border border-gray-50 rounded bg-gray-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-500 mx-auto mb-4">
                <FiGift className="h-6 w-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-brand-charcoal mb-2">Ecological Craft</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Using organic fibers, botanical extracts for fabric dyes, and eco-friendly zero-waste compostable packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Blocks */}
      <section className="py-20 bg-brand-cream border-t border-brand-green-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 border-b border-gray-200 pb-5">
            <div>
              <h2 className="font-playfair text-3xl font-black tracking-wide text-brand-charcoal">Shop by Category</h2>
              <p className="text-xs font-semibold text-brand-gold-500 uppercase tracking-widest mt-1">Curated selections of Kerala craft</p>
            </div>
            <Link to="/shop" className="mt-4 sm:mt-0 flex items-center gap-1.5 text-sm font-bold text-brand-green-500 hover:text-brand-gold-500 transition-colors">
              View All Catalog <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative h-96 overflow-hidden rounded shadow-premium hover:shadow-premium-hover transition-shadow"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold-500 block mb-1">
                    {cat.label}
                  </span>
                  <h3 className="font-playfair text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-xs font-light text-gray-300 mb-4">{cat.desc}</p>
                  <Link
                    to={cat.link}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-gold-300 hover:text-white transition-colors"
                  >
                    Browse Items <FiArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold-500 block mb-2">Signature Releases</span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-charcoal">Featured Creations</h2>
            <p className="font-sans text-sm text-gray-500 font-light mt-2">Discover high-end luxury items handpicked for the modern catalog.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-200 aspect-[4/5] rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-10 bg-brand-cream border border-dashed border-gray-200 rounded">
              <p className="text-sm font-medium text-gray-400">No featured products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-brand-green-500 py-3.5 px-8 rounded text-sm font-bold text-brand-green-500 hover:bg-brand-green-50 transition-colors uppercase tracking-widest"
            >
              Shop Full Collection
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
