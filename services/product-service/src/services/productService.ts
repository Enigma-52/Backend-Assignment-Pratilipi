import Product, { IProduct } from '../models/Product';
import { emitProductCreated, emitInventoryUpdated } from '../events/producers/productProducer';

export class ProductService {
  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    const newProduct = new Product(productData);
    await newProduct.save();
    await emitProductCreated(newProduct);
    return newProduct;
  }

  async getProduct(productId: string): Promise<IProduct | null> {
    return Product.findById(productId);
  }

  async updateProduct(productId: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (updatedProduct && 'inventory' in updateData) {
      await emitInventoryUpdated(updatedProduct);
    }
    return updatedProduct;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(productId);
    return !!result;
  }

  async updateInventory(productId: string, quantity: number): Promise<IProduct | null> {
    const product = await Product.findById(productId);
    if (!product) return null;

    product.inventory += quantity;
    if (product.inventory < 0) product.inventory = 0;
    
    await product.save();
    await emitInventoryUpdated(product);
    return product;
  }

  async getAllProducts(): Promise<IProduct[]> {
    return Product.find();
  }
}

export const productService = new ProductService();