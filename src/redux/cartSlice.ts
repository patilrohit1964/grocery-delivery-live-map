import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";
interface IGROCERY {
  _id?: mongoose.Types.ObjectId;
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
}
const initialState: ICartSlice = {
  cartData: [],
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
      }
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
