import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const createAppStore = () => {
  const saved = localStorage.getItem('cart');
  const preloadedCartItems = saved ? JSON.parse(saved) : [];

  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: {
        cartItems: preloadedCartItems,
      },
    },
  });

  store.subscribe(() => {
    const { cartItems } = store.getState().cart;
    localStorage.setItem('cart', JSON.stringify(cartItems));
  });

  return store;
};
