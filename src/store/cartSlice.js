import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.menuItemId === item._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.cartItems.push({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      });
    },
    removeFromCart: (state, action) => {
      const menuItemId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.menuItemId !== menuItemId
      );
    },
    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;

      if (quantity <= 0) {
        state.cartItems = state.cartItems.filter(
          (item) => item.menuItemId !== menuItemId
        );
        return;
      }

      const item = state.cartItems.find((cartItem) => cartItem.menuItemId === menuItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
