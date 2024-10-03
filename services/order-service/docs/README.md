## Order Service API

### Base URL: `http://localhost:3003/api/orders`

### 1. Create Order
- **Endpoint**: `/`
- **Method**: `POST`
- **Description**: Create a new order
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "userId": "string",
    "items": [
      {
        "productId": "string",
        "quantity": number,
        "price": number
      }
    ]
  }
  ```
- **Response**:
  - Success (201):
    ```json
    {
      "id": "string",
      "userId": "string",
      "items": [
        {
          "productId": "string",
          "quantity": number,
          "price": number
        }
      ],
      "total": number,
      "status": "pending",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - Error (400):
    ```json
    {
      "message": "Error creating order",
      "error": "Error details"
    }
    ```

### 2. Get All Orders
- **Endpoint**: `/`
- **Method**: `GET`
- **Description**: Retrieve all orders
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Response**:
  - Success (200):
    ```json
    [
      {
        "id": "string",
        "userId": "string",
        "items": [
          {
            "productId": "string",
            "quantity": number,
            "price": number
          }
        ],
        "total": number,
        "status": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
    ```
  - Error (400):
    ```json
    {
      "message": "Error fetching orders",
      "error": "Error details"
    }
    ```

### 3. Get Order by ID
- **Endpoint**: `/:id`
- **Method**: `GET`
- **Description**: Retrieve a specific order by ID
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Parameters**: 
  - `id`: Order ID
- **Response**:
  - Success (200):
    ```json
    {
      "id": "string",
      "userId": "string",
      "items": [
        {
          "productId": "string",
          "quantity": number,
          "price": number
        }
      ],
      "total": number,
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - Error (404):
    ```json
    {
      "message": "Order not found"
    }
    ```
  - Error (400):
    ```json
    {
      "message": "Error fetching order",
      "error": "Error details"
    }
    ```

### 4. Get User Orders
- **Endpoint**: `/user/:userId`
- **Method**: `GET`
- **Description**: Retrieve all orders for a specific user
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Parameters**: 
  - `userId`: User ID
- **Response**:
  - Success (200):
    ```json
    [
      {
        "id": "string",
        "userId": "string",
        "items": [
          {
            "productId": "string",
            "quantity": number,
            "price": number
          }
        ],
        "total": number,
        "status": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
    ```
  - Error (400):
    ```json
    {
      "message": "Error fetching user orders",
      "error": "Error details"
    }
    ```

### 5. Update Order Status
- **Endpoint**: `/:id/status`
- **Method**: `PUT`
- **Description**: Update the status of an order
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Parameters**: 
  - `id`: Order ID
- **Request Body**:
  ```json
  {
    "status": "shipped" | "delivered"
  }
  ```
- **Response**:
  - Success (200):
    ```json
    {
      "id": "string",
      "userId": "string",
      "items": [
        {
          "productId": "string",
          "quantity": number,
          "price": number
        }
      ],
      "total": number,
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - Error (404):
    ```json
    {
      "message": "Order not found"
    }
    ```
  - Error (400):
    ```json
    {
      "message": "Error updating order status",
      "error": "Error details"
    }
    ```
