import { Schema, Document, model } from "mongoose";

type Product = {
  name: string;
  price: number;
  size: string;
};

type Receipt = {
  receiptId: string;
  total: number,
  timestamp: string,
  products: Product[]; 
};

type User = Document & {
  name: string;
  surname?: string;
  email: string;
  password: string;
  receipts: Receipt[]; 
};

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
  },
  { _id: false } 
);

const ReceiptSchema = new Schema<Receipt>(
  {
    receiptId: { type: String, required: true },
    timestamp: {type: String, required: true},
    total: {type: Number, required: true},
    products: [ProductSchema], 
  },
  { _id: false },
);

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    receipts: [ReceiptSchema], 
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

const User = model<User>("User", UserSchema);

export default User;
