## User Service API

### Base URL: `http://localhost:3001/api/users`

### 1. Register User
- **Endpoint**: `/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - Success (201):
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "string",
        "username": "string",
        "email": "string"
      }
    }
    ```
  - Error (400):
    ```json
    {
      "message": "Error message"
    }
    ```

### 2. Login User
- **Endpoint**: `/login`
- **Method**: `POST`
- **Description**: Authenticate a user and get a token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - Success (200):
    ```json
    {
      "token": "string",
    }
    ```
  - Error (401):
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

### 3. Get User Profile
- **Endpoint**: `/profile`
- **Method**: `GET`
- **Description**: Get the profile of the authenticated user
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Response**:
  - Success (200):
    ```json
    {
      "user":{
        "id": "string",
        "username": "string",
        "email": "string"
      }
    }
    ```
  - Error (401):
    ```json
    {
      "message": "Invalid or expired token"
    }
    ```

### 4. Update User Profile
- **Endpoint**: `/profile`
- **Method**: `PUT`
- **Description**: Update the profile of the authenticated user
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string"
  }
  ```
- **Response**:
  - Success (200):
    ```json
    {
      "message": "Profile updated successfully",
      "user": {
        "id": "string",
        "username": "string",
        "email": "string"
      }
    }
    ```
  - Error (400/401):
    ```json
    {
      "message": "Invalid or expired token"
    }
    ```