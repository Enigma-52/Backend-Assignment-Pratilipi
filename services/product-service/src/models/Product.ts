import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  inventory: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);