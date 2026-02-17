import { persistStore } from 'redux-persist';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
const rootReducer = combineReducers({
  user: userSlice,
  cart: cartSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
const persitedStore=persistStore(store,)

// Infer the type of makeStore
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
