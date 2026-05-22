import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-brand-charcoal text-gray-400 border-t border-brand-slate pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2">
          {/* Brand Intro */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="font-playfair text-2xl font-bold tracking-widest text-white">
                KADAWAVE
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold-500 -mt-1 pl-0.5">
                KERALA LUXURY
              </span>
            </Link>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Bridging traditional Kerala artisan craftsmanship with modern luxury lifestyle aesthetics. Authentic, sustainable, and premium.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.instagram.com/_.kaamaal._/?hl=en" className="hover:text-brand-gold-500 transition-colors"><FiInstagram className="h-5 w-5" /></a>
              {/* <a href="#" className="hover:text-brand-gold-500 transition-colors"><FiTwitter className="h-5 w-5" /></a> */}
              <a href="https://www.facebook.com/profile.php?id=100087442854878" className="hover:text-brand-gold-500 transition-colors"><FiFacebook className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm font-light">
              <li><Link to="/" className="hover:text-brand-gold-500 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-brand-gold-500 transition-colors">Shop Catalog</Link></li>
              <li><Link to="/cart" className="hover:text-brand-gold-500 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/login" className="hover:text-brand-gold-500 transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-sm font-light">
              <li><Link to="/shop?category=Fashion" className="hover:text-brand-gold-500 transition-colors">Ethnic Fashion</Link></li>
              <li><Link to="/shop?category=Home Decor" className="hover:text-brand-gold-500 transition-colors">Home Decor</Link></li>
              <li><Link to="/shop?category=Spices & Teas" className="hover:text-brand-gold-500 transition-colors">Spices & Blends</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-brand-gold-500 transition-colors">Eco Accessories</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="h-5 w-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <span>Karanthur Kunnamangalam, Kozhikode, Kerala - 673571</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="h-5 w-5 text-brand-gold-500 shrink-0" />
                <span>kamalrajmanu@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="h-5 w-5 text-brand-gold-500 shrink-0" />
                <span>+91 6238473146</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-brand-slate pt-8 text-center text-xs text-gray-600 font-light">
          <p>© {new Date().getFullYear()} KadaWave. Made with passion inspired by the Backwaters of Kerala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
