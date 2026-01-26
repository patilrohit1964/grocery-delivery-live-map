import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
// import persistReducer from "redux-persist/es/persistReducer";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import localStorage from "redux-persist/es/storage";
// const authPersistConfig = {
//   key: "auth",
//   storage: localStorage,
// };

// const cartPersistConfig = {
//   key: "cart",
//   storage: localStorage,
// };
const rootReducer = combineReducers({
  user: userSlice,
  cart: cartSlice,
});
// const persistConfig = {
//   key: "root",
//   storage,
// };
// const persistedReducer = persistReducer(persistConfig, cartSlice);
export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({}),
});

// Infer the type of makeStore
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
