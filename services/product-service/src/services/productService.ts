import { PrismaClient } from '@prisma/client';
import { IProductInput, IProductOutput } from '../../types/product';
import { publishProductCreated, publishInventoryUpdated } from '../events/producers/productProducer';

const prisma = new PrismaClient();

export class ProductService {
  static async createProduct(productData: IProductInput): Promise<IProductOutput> {
    const product = await prisma.product.create({
      data: productData,
    });

    await publishProductCreated(product);

    return product;
  }

  static async getProduct(id: string): Promise<IProductOutput | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  static async updateProduct(id: string, productData: Partial<IProductInput>): Promise<IProductOutput> {
    const product = await prisma.product.update({
      where: { id },
      data: productData,
    });

    if (productData.inventory !== undefined) {
      await publishInventoryUpdated(product);
    }

    return product;
  }

  static async deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  static async getAllProducts(): Promise<IProductOutput[]> {
    return prisma.product.findMany();
  }

  static async updateInventory(id: string, quantityChange: number): Promise<IProductOutput> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        inventory: {
          decrement: quantityChange,
        },
      },
    });

    await publishInventoryUpdated(product);

    return product;
  }
}