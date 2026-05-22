import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer Block */}
      <Footer />
    </div>
  );
};

export default Layout;
