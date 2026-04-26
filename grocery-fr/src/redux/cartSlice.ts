import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";
interface IGROCERY {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ICartSlice {
  cartData: IGROCERY[];
  subTotal: number;
  deliveryFee: number;
  finalTotal: number;
}
const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  finalTotal: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGROCERY>) => {
      const existingItem = state.cartData?.find(
        (cart) => cart?._id === action.payload._id,
      );
      if (existingItem) {
        state.cartData = state.cartData?.map((cart) =>
          cart._id == action.payload?._id
            ? { ...cart, quantity: cart.quantity + 1 }
            : cart,
        );
        return;
      }
      state.cartData?.push(action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const existingItem = state.cartData?.findIndex(
        (cart) => cart?._id === action.payload,
      );
      if (existingItem !== -1) {
        if (state.cartData[existingItem].quantity >= 1) {
          state.cartData[existingItem].quantity += 1;
        }
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const existingItem = state.cartData?.findIndex(
        (cart) => cart?._id === action?.payload,
      );
      if (existingItem !== -1) {
        if (state.cartData[existingItem].quantity > 1) {
          state.cartData[existingItem].quantity -= 1;
        } else {
          state.cartData = state.cartData?.filter(
            (cart) => cart._id !== state.cartData[existingItem]._id,
          );
        }
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter(
        (cart) => cart._id !== action.payload,
      );
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      state.subTotal = state.cartData.reduce(
        (acc, cart) => acc + Number(cart.price) * cart.quantity,
        0,
      );
      state.deliveryFee = state.subTotal > 100 ? 0 : 40;
      state.finalTotal = state.subTotal + state.deliveryFee;
    },
    clearCart: (state) => {
      state.cartData = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  calculateTotals,
  clearCart
} = cartSlice.actions;
export default cartSlice.reducer;
