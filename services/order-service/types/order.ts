export interface IOrderItem {
    productId: string;
    quantity: number;
    price: number;
  }
  
  export interface IOrderInput {
    userId: string;
    items: IOrderItem[];
  }
  
  export interface IOrder {
    id: string;
    userId: string;
    status: string;
    items: IOrderItem[];
    total: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IProductCreatedEvent {
    id: string;
    name: string;
    price: number;
    inventory: number;
  }
  
  export interface IUserRegisteredEvent {
    id: string;
    email: string;
  }