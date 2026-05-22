import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage on startup
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
        setCartItems([]);
      }
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  // Add Item to Cart
  const addToCart = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product === product._id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let updatedCart = [...cartItems];

    if (existingIndex > -1) {
      // Item exists, increase quantity up to stock
      const newQty = updatedCart[existingIndex].quantity + quantity;
      updatedCart[existingIndex].quantity = Math.min(newQty, product.stock);
    } else {
      // Add new item
      updatedCart.push({
        product: product._id,
        title: product.title,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        slug: product.slug,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock),
        selectedSize,
        selectedColor,
      });
    }

    saveCart(updatedCart);
  };

  // Remove Item from Cart
  const removeFromCart = (productId, selectedSize = '', selectedColor = '') => {
    const updatedCart = cartItems.filter(
      (item) =>
        !(
          item.product === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        )
    );
    saveCart(updatedCart);
  };

  // Update Item Quantity
  const updateQuantity = (productId, selectedSize = '', selectedColor = '', newQty) => {
    if (newQty < 1) return;
    
    const updatedCart = cartItems.map((item) => {
      if (
        item.product === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      ) {
        return { ...item, quantity: Math.min(newQty, item.stock) };
      }
      return item;
    });

    saveCart(updatedCart);
  };

  // Clear all items in Cart
  const clearCart = () => {
    saveCart([]);
  };

  // Compute total items count
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Compute total cart price
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
