import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    inventory: Int!
  }

  type Order {
    id: ID!
    userId: ID!
    products: [OrderProduct!]!
    totalAmount: Float!
    status: String!
  }

  type OrderProduct {
    product: Product!
    quantity: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
  username: String!
  email: String!
  password: String!
}

type RegisterResponse {
  message: String!
  user: User!
}

  input LoginInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    inventory: Int!
  }

  input OrderInput {
    products: [OrderProductInput!]!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    me: User
    products: [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
    userOrders: [Order!]!
  }

  type Mutation {
    registerUser(input: RegisterInput!): RegisterResponse
    loginUser(input: LoginInput!): AuthPayload
    updateUserProfile(input: RegisterInput!): User
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
    createOrder(input: OrderInput!): Order
    updateOrderStatus(id: ID!, status: String!): Order
  }
`;
