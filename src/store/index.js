import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       // Ignore these action types
  //       ignoredActions: ['products/fetchProducts/fulfilled'],
  //       // Ignore these field paths in all actions
  //       ignoredActionPaths: ['payload.rating', 'payload.createdAt'],
  //       // Ignore these paths in the state
  //       ignoredPaths: ['products.items.rating', 'products.items.createdAt'],
  //     },
  //   }),
});