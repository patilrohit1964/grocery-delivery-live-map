"use client";
import { Provider } from "react-redux";
import { persitedStore, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persitedStore} loading={<h1>Loading...</h1>}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
