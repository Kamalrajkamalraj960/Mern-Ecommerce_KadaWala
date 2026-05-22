import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiGrid,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-black tracking-[0.25em] text-black">
              KADAWAVE
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-500 -mt-1">
              Kerala Luxury
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${isActive
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-600 hover:text-black'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black hover:text-gray-600 transition"
              >
                <FiGrid className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-5">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-black transition"
            >
              <FiShoppingCart className="h-6 w-6" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() =>
                  setProfileDropdownOpen(!profileDropdownOpen)
                }
                className="p-2 text-gray-700 hover:text-black transition"
              >
                <FiUser className="h-6 w-6" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() =>
                        setProfileDropdownOpen(false)
                      }
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-20 mt-3 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden"
                    >
                      {user ? (
                        <div>
                          <div className="border-b border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-500">
                              Logged in as
                            </p>

                            <p className="truncate text-sm font-semibold text-black">
                              {user.email}
                            </p>
                          </div>

                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() =>
                                setProfileDropdownOpen(false)
                              }
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Dashboard
                            </Link>
                          )}

                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <FiLogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Link
                            to="/login"
                            onClick={() =>
                              setProfileDropdownOpen(false)
                            }
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Login
                          </Link>

                          <Link
                            to="/register"
                            onClick={() =>
                              setProfileDropdownOpen(false)
                            }
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Register
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Right */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700"
            >
              <FiShoppingCart className="h-6 w-6" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-700"
            >
              <FiMenu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            >
              {/* Top */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-black tracking-[0.25em] text-black">
                    KADAWAVE
                  </h2>

                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    Kerala Luxury
                  </p>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-700"
                >
                  <FiX className="h-7 w-7" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-1 flex-col px-6 py-8">
                <div className="space-y-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className="block text-lg font-semibold uppercase tracking-wider text-gray-800 hover:text-black"
                    >
                      {item.name}
                    </Link>
                  ))}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className="block text-lg font-semibold uppercase tracking-wider text-black"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>

                {/* Bottom */}
                <div className="mt-auto border-t border-gray-200 pt-6">
                  {user ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white font-bold">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-black">
                            {user.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
                      >
                        <FiLogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="rounded-xl border border-black py-3 text-center text-sm font-semibold text-black transition hover:bg-gray-100"
                      >
                        Login
                      </Link>

                      <Link
                        to="/register"
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="rounded-xl bg-black py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;