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
    "products": [
      {
        "productId": "string",
        "quantity": number
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
      "products": [
        {
          "productId": "string",
          "quantity": number
        }
      ],
      "totalAmount": number,
      "status": "string"
    }
    ```
  - Error (400/401):
    ```json
    {
      "message": "Error message"
    }
    ```

### 2. Get All Orders
- **Endpoint**: `/`
- **Method**: `GET`
- **Description**: Retrieve all orders (admin only)
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Response**:
  - Success (200):
    ```json
    [
      {
        "id": "string",
        "userId": "string",
        "products": [
          {
            "productId": "string",
            "quantity": number
          }
        ],
        "totalAmount": number,
        "status": "string"
      }
    ]
    ```
  - Error (401/403):
    ```json
    {
      "message": "Error message"
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
      "products": [
        {
          "productId": "string",
          "quantity": number
        }
      ],
      "totalAmount": number,
      "status": "string"
    }
    ```
  - Error (401/404):
    ```json
    {
      "message": "Error message"
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
        "products": [
          {
            "productId": "string",
            "quantity": number
          }
        ],
        "totalAmount": number,
        "status": "string"
      }
    ]
    ```
  - Error (401/404):
    ```json
    {
      "message": "Error message"
    }
    ```

### 5. Update Order Status
- **Endpoint**: `/:id/status`
- **Method**: `PUT`
- **Description**: Update the status of an order (admin only)
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Parameters**: 
  - `id`: Order ID
- **Request Body**:
  ```json
  {
    "status": "string"
  }
  ```
- **Response**:
  - Success (200):
    ```json
    {
      "id": "string",
      "userId": "string",
      "products": [
        {
          "productId": "string",
          "quantity": number
        }
      ],
      "totalAmount": number,
      "status": "string"
    }
    ```
  - Error (400/401/403/404):
    ```json
    {
      "message": "Error message"
    }
    ```