import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiHome, FiGrid, FiShoppingBag, FiList, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <FiGrid className="h-5 w-5" />, end: true },
    { name: 'Products', path: '/admin/products', icon: <FiShoppingBag className="h-5 w-5" />, end: false },
    { name: 'Orders', path: '/admin/orders', icon: <FiList className="h-5 w-5" />, end: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-brand-charcoal text-white shrink-0 border-r border-brand-slate">
        <div className="flex items-center h-20 px-6 border-b border-brand-slate">
          <Link to="/" className="flex flex-col">
            <span className="font-playfair text-xl font-bold tracking-widest text-white">KADAWAVE</span>
            <span className="text-[8px] font-bold tracking-[0.3em] text-brand-gold-500 uppercase -mt-0.5">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold tracking-wider uppercase transition-colors ${
                  isActive
                    ? 'bg-brand-green-500 text-white'
                    : 'text-gray-400 hover:bg-brand-slate hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-slate space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-brand-gold-500 hover:bg-brand-slate hover:text-white transition-colors"
          >
            <FiHome className="h-5 w-5" />
            Go to Shop
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Drawer for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-brand-charcoal text-white lg:hidden"
            >
              <div className="flex items-center justify-between h-20 px-6 border-b border-brand-slate">
                <Link to="/" className="flex flex-col">
                  <span className="font-playfair text-xl font-bold tracking-widest text-white">KADAWAVE</span>
                  <span className="text-[8px] font-bold tracking-[0.3em] text-brand-gold-500 uppercase -mt-0.5">Admin Portal</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold tracking-wider uppercase transition-colors ${
                        isActive
                          ? 'bg-brand-green-500 text-white'
                          : 'text-gray-400 hover:bg-brand-slate hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-brand-slate space-y-3">
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-brand-gold-500 hover:bg-brand-slate hover:text-white transition-colors"
                >
                  <FiHome className="h-5 w-5" />
                  Go to Shop
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Administrative Container */}
      <div className="flex flex-col flex-grow h-screen overflow-hidden">
        
        {/* Admin Topbar */}
        <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-brand-charcoal hover:bg-gray-100 rounded lg:hidden focus:outline-none"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h1 className="font-playfair text-xl font-bold text-brand-charcoal hidden sm:block">
              Control Center
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-brand-charcoal">{user?.name}</p>
              <p className="text-xs text-gray-400 font-medium">System Administrator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-500 text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Dashboard Page */}
        <main className="flex-grow p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
