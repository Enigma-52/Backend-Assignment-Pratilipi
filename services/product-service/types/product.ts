export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IProductInput {
    name: string;
    description: string;
    price: number;
    inventory: number;
  }
  
  export interface IProductOutput {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
  }