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
      state.cartData?.push(action.payload);
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
