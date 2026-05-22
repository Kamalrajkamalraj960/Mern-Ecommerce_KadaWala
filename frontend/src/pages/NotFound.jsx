import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-brand-cream px-4 text-center">
      <FiAlertOctagon className="h-16 w-16 text-brand-gold-500 mb-6 animate-pulse" />
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold-500 block mb-2">
        Error 404
      </span>
      <h1 className="font-playfair text-4xl sm:text-5xl font-black text-brand-charcoal mb-4">
        Shoreline Lost
      </h1>
      <p className="font-sans text-sm font-light text-gray-500 max-w-md mb-8 leading-relaxed">
        The page you are trying to visit does not exist or has been shifted in the backwaters of our database.
      </p>
      <Link
        to="/"
        className="bg-brand-green-500 hover:bg-brand-charcoal text-white text-xs font-bold py-4 px-8 rounded uppercase tracking-widest transition-colors shadow-md"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
