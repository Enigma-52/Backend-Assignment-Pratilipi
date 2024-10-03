## Product Service API

### Base URL: `http://localhost:3002/api/products`

### 1. Create Product
- **Endpoint**: `/`
- **Method**: `POST`
- **Description**: Create a new product (admin only)
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": number,
    "inventory": number
  }
  ```
- **Response**:
  - Success (201):
    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "inventory": number
    }
    ```
  - Error (400/401/403):
    ```json
    {
      "message": "Error message"
    }
    ```

### 2. Get All Products
- **Endpoint**: `/`
- **Method**: `GET`
- **Description**: Retrieve all products
- **Response**:
  - Success (200):
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": number,
        "inventory": number
      }
    ]
    ```

### 3. Get Product by ID
- **Endpoint**: `/:id`
- **Method**: `GET`
- **Description**: Retrieve a specific product by ID
- **Parameters**: 
  - `id`: Product ID
- **Response**:
  - Success (200):
    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "inventory": number
    }
    ```
  - Error (404):
    ```json
    {
      "message": "Product not found"
    }
    ```

### 4. Update Product
- **Endpoint**: `/:id`
- **Method**: `PUT`
- **Description**: Update a product (admin only)
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Parameters**: 
  - `id`: Product ID
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": number,
    "inventory": number
  }
  ```
- **Response**:
  - Success (200):
    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "inventory": number
    }
    ```
  - Error (400/401/403/404):
    ```json
    {
      "message": "Error message"
    }
    ```

### 5. Delete Product
- **Endpoint**: `/:id`
- **Method**: `DELETE`
- **Description**: Delete a product (admin only)
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Parameters**: 
  - `id`: Product ID
- **Response**:
  - Success (200):
    ```json
    {
      "message": "Product deleted successfully"
    }
    ```
  - Error (401/403/404):
    ```json
    {
      "message": "Error message"
    }
    ```