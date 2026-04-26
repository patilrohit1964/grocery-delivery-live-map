import { persistStore } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
import persistReducer from "redux-persist/es/persistReducer";
import localStorage from "redux-persist/es/storage";
const rootReducer = combineReducers({
  user: userSlice,
  cart: cartSlice,
});
const persistReducers = persistReducer(
  { key: "root", storage: localStorage, whitelist: ["cart", "user"] },
  rootReducer,
);
export const store = configureStore({
  reducer: persistReducers,
  middleware: (getDifaultMiddleware) =>
    getDifaultMiddleware({ serializableCheck: false }),
});
export const persitedStore = persistStore(store);

// Infer the type of makeStore
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
