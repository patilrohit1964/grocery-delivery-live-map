import mongoose from "mongoose";
interface IGROCERY {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const grocerySchema = new mongoose.Schema<IGROCERY>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "fruits & vegetables",
        "dairy & eggs",
        "rice,atta & grains",
        "snaks & biscuits",
        "spices & masalas",
        "beverages & drinks",
        "personal care",
        "household essentials",
        "instant & packaged food",
        "baby & pet care",
      ],
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Grocery =
  mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);
export default Grocery;
