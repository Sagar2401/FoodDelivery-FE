import React, { useMemo, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createAppStore } from '../store/createStore';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from '../store/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const addToCart = (item) => {
    dispatch(addToCartAction(item));
  };

  const removeFromCart = (menuItemId) => {
    dispatch(removeFromCartAction(menuItemId));
  };

  const updateQuantity = (menuItemId, quantity) => {
    dispatch(updateQuantityAction({ menuItemId, quantity }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  return useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
    }),
    [cartItems]
  );
};

export const CartProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
};
