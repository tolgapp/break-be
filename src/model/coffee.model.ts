import { Schema, Document, model } from "mongoose";

interface Coffee extends Document {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  sizes: string[];
  image: string;
  prices: number[];
  tags: string[];
}

const CoffeesSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  sizes: { type: [String], required: true },
  image: { type: String, required: true },
  prices: { type: [Number], required: true },
  tags: { type: [String], required: true },
});

const CoffeeSpecialty = model<Coffee>(
  "Coffees",
  CoffeesSchema
);

export default CoffeeSpecialty;
