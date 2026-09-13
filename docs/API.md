# API Documentation

## Base URL

```
http://localhost:5000/api
```

All API endpoints below are relative to this base URL.

---

# Category APIs

## 1. Create Category

Creates a new product category.

### Request

```http
POST /categories
```

### Request Body

Content-Type:

```text
application/json
```

```json
{
  "name": "Electronics"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "message": "Category created successfully",
  "category": {
    "id": 1,
    "name": "Electronics",
    "status": true,
    "createdAt": "2026-09-13T10:00:00.000Z",
    "updatedAt": "2026-09-13T10:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Category name is required"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to create category"
}
```

---

## 2. List Categories

Returns all categories.

### Request

```http
GET /categories
```

### Success Response

**Status:** `200 OK`

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "status": true,
      "createdAt": "2026-09-13T10:00:00.000Z",
      "updatedAt": "2026-09-13T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Books",
      "status": true,
      "createdAt": "2026-09-13T10:05:00.000Z",
      "updatedAt": "2026-09-13T10:05:00.000Z"
    }
  ]
}
```

### Error Response

**500 Internal Server Error**

```json
{
  "message": "Failed to fetch categories"
}
```

---

## 3. Get Category

Returns a category using its ID.

### Request

```http
GET /categories/:id
```

### Example

```http
GET /categories/1
```

### Success Response

**Status:** `200 OK`

```json
{
  "category": {
    "id": 1,
    "name": "Electronics",
    "status": true,
    "createdAt": "2026-09-13T10:00:00.000Z",
    "updatedAt": "2026-09-13T10:00:00.000Z"
  }
}
```

### Error Responses

**404 Not Found**

```json
{
  "message": "Category not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to fetch category"
}
```

---

## 4. Update Category

Updates the name of an existing category.

### Request

```http
PUT /categories/:id
```

### Example

```http
PUT /categories/1
```

### Request Body

Content-Type:

```text
application/json
```

```json
{
  "name": "Consumer Electronics"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Category updated successfully",
  "category": {
    "id": 1,
    "name": "Consumer Electronics",
    "status": true,
    "createdAt": "2026-09-13T10:00:00.000Z",
    "updatedAt": "2026-09-13T11:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Category name is required"
}
```

**404 Not Found**

```json
{
  "message": "Category not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to update category"
}
```

---

## 5. Delete Category

Deletes a category by ID.

### Request

```http
DELETE /categories/:id
```

### Example

```http
DELETE /categories/1
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Category deleted successfully"
}
```

### Error Responses

**404 Not Found**

```json
{
  "message": "Category not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to delete category"
}
```

---

## 6. Update Category Status

Activates or deactivates a category.

### Request

```http
PATCH /categories/:id/status
```

### Example

```http
PATCH /categories/1/status
```

### Request Body

Content-Type:

```text
application/json
```

```json
{
  "status": false
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Category status updated successfully",
  "category": {
    "id": 1,
    "name": "Electronics",
    "status": false,
    "createdAt": "2026-09-13T10:00:00.000Z",
    "updatedAt": "2026-09-13T11:10:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Status must be true or false"
}
```

**404 Not Found**

```json
{
  "message": "Category not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to update category status"
}
```

---

# Product APIs

## 1. Create Product

Creates a new product.

### Request

```http
POST /products
```

### Content Type

```text
multipart/form-data
```

### Form Fields

| Field           | Type           | Required | Description                  |
| --------------- | -------------- | -------: | ---------------------------- |
| `name`          | String         |      Yes | Product name                 |
| `sku`           | String         |       No | Unique product SKU           |
| `description`   | String         |       No | Product description          |
| `price`         | Number         |      Yes | Non-negative product price   |
| `stock`         | Integer        |      Yes | Non-negative stock quantity  |
| `categoryId`    | Integer        |      Yes | Existing category ID         |
| `featured`      | Boolean/String |       No | Featured product flag        |
| `returnable`    | Boolean/String |       No | Returnable product flag      |
| `productType`   | String         |       No | `Physical` or `Digital`      |
| `availability`  | String         |       No | `Available` or `Unavailable` |
| `availableDate` | Date           |       No | Product available date       |
| `image`         | File           |       No | JPG, PNG, WEBP or GIF        |

### Example Form Data

```text
name: Wireless Headphones
sku: WH-1001
description: Bluetooth wireless headphones
price: 2499.00
stock: 25
categoryId: 1
featured: true
returnable: true
productType: Physical
availability: Available
availableDate: 2026-09-20
image: <image file>
```

### Image Requirements

Maximum file size:

```text
5 MB
```

Allowed formats:

```text
JPG
PNG
WEBP
GIF
```

### Success Response

**Status:** `201 Created`

```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "sku": "WH-1001",
    "description": "Bluetooth wireless headphones",
    "price": "2499.00",
    "stock": 25,
    "categoryId": 1,
    "featured": true,
    "returnable": true,
    "productType": "Physical",
    "availability": "Available",
    "availableDate": "2026-09-20",
    "imageUrl": "/uploads/1726220000000-123456789.jpg",
    "status": true,
    "createdAt": "2026-09-13T10:00:00.000Z",
    "updatedAt": "2026-09-13T10:00:00.000Z",
    "Category": {
      "id": 1,
      "name": "Electronics"
    }
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Product name is required"
}
```

or

```json
{
  "message": "Valid price is required"
}
```

or

```json
{
  "message": "Valid stock value is required"
}
```

or

```json
{
  "message": "Category is required"
}
```

**404 Not Found**

```json
{
  "message": "Category not found"
}
```

**409 Conflict**

```json
{
  "message": "SKU already exists"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to create product"
}
```

---

## 2. List Products

Returns a paginated list of products.

### Request

```http
GET /products
```

### Query Parameters

| Parameter    | Type    | Default | Description                   |
| ------------ | ------- | ------: | ----------------------------- |
| `search`     | String  |       - | Searches product name and SKU |
| `categoryId` | Integer |       - | Filters products by category  |
| `page`       | Integer |     `1` | Page number                   |
| `limit`      | Integer |    `10` | Number of products per page   |

Maximum `limit` is `100`.

### Examples

Get all products:

```http
GET /products
```

Search products:

```http
GET /products?search=headphones
```

Filter by category:

```http
GET /products?categoryId=1
```

Pagination:

```http
GET /products?page=2&limit=10
```

Combined search and pagination:

```http
GET /products?search=headphones&categoryId=1&page=1&limit=10
```

### Success Response

**Status:** `200 OK`

```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "sku": "WH-1001",
      "description": "Bluetooth wireless headphones",
      "price": "2499.00",
      "stock": 25,
      "categoryId": 1,
      "featured": true,
      "returnable": true,
      "productType": "Physical",
      "availability": "Available",
      "availableDate": "2026-09-20",
      "imageUrl": "/uploads/1726220000000-123456789.jpg",
      "status": true,
      "createdAt": "2026-09-13T10:00:00.000Z",
      "updatedAt": "2026-09-13T10:00:00.000Z",
      "Category": {
        "id": 1,
        "name": "Electronics"
      }
    }
  ],
  "pagination": {
    "totalItems": 1,
    "currentPage": 1,
    "totalPages": 1,
    "limit": 10
  }
}
```

### Error Response

**500 Internal Server Error**

```json
{
  "message": "Failed to fetch products"
}
```

---

## 3. Get Product

Returns a single product by ID.

### Request

```http
GET /products/:id
```

### Example

```http
GET /products/1
```

### Success Response

**Status:** `200 OK`

```json
{
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "sku": "WH-1001",
    "description": "Bluetooth wireless headphones",
    "price": "2499.00",
    "stock": 25,
    "categoryId": 1,
    "featured": true,
    "returnable": true,
    "productType": "Physical",
    "availability": "Available",
    "availableDate": "2026-09-20",
    "imageUrl": "/uploads/1726220000000-123456789.jpg",
    "status": true,
    "Category": {
      "id": 1,
      "name": "Electronics"
    }
  }
}
```

### Error Responses

**404 Not Found**

```json
{
  "message": "Product not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to fetch product"
}
```

---

## 4. Update Product

Updates an existing product. An optional new image can also be uploaded.

### Request

```http
PUT /products/:id
```

### Example

```http
PUT /products/1
```

### Content Type

```text
multipart/form-data
```

### Form Fields

| Field           | Type           | Required | Description                  |
| --------------- | -------------- | -------: | ---------------------------- |
| `name`          | String         |       No | Product name                 |
| `sku`           | String         |       No | Unique product SKU           |
| `description`   | String         |       No | Product description          |
| `price`         | Number         |       No | Non-negative product price   |
| `stock`         | Integer        |       No | Non-negative stock quantity  |
| `categoryId`    | Integer        |       No | Existing category ID         |
| `featured`      | Boolean/String |       No | Featured product flag        |
| `returnable`    | Boolean/String |       No | Returnable product flag      |
| `productType`   | String         |       No | `Physical` or `Digital`      |
| `availability`  | String         |       No | `Available` or `Unavailable` |
| `availableDate` | Date           |       No | Product available date       |
| `image`         | File           |       No | Replacement product image    |

Only supplied optional fields are updated.

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "name": "Updated Wireless Headphones",
    "sku": "WH-1001",
    "description": "Updated product description",
    "price": "2799.00",
    "stock": 30,
    "categoryId": 1,
    "featured": true,
    "returnable": true,
    "productType": "Physical",
    "availability": "Available",
    "availableDate": "2026-09-20",
    "imageUrl": "/uploads/1726221000000-987654321.jpg",
    "status": true,
    "Category": {
      "id": 1,
      "name": "Electronics"
    }
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Valid price is required"
}
```

**404 Not Found**

```json
{
  "message": "Product not found"
}
```

or

```json
{
  "message": "Category not found"
}
```

**409 Conflict**

```json
{
  "message": "SKU already exists"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to update product"
}
```

---

## 5. Delete Product

Deletes a product and removes its associated uploaded image.

### Request

```http
DELETE /products/:id
```

### Example

```http
DELETE /products/1
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Product deleted successfully"
}
```

### Error Responses

**404 Not Found**

```json
{
  "message": "Product not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to delete product"
}
```

---

## 6. Update Product Stock

Updates only the stock quantity of a product.

### Request

```http
PATCH /products/:id/stock
```

### Example

```http
PATCH /products/1/stock
```

### Request Body

Content-Type:

```text
application/json
```

```json
{
  "stock": 50
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Product stock updated successfully",
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "stock": 50
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Valid stock value is required"
}
```

**404 Not Found**

```json
{
  "message": "Product not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to update product stock"
}
```

---

## 7. Update Product Status

Activates or deactivates a product.

### Request

```http
PATCH /products/:id/status
```

### Example

```http
PATCH /products/1/status
```

### Request Body

Content-Type:

```text
application/json
```

```json
{
  "status": false
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Product status updated successfully",
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "stock": 50,
    "status": false
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Status must be true or false"
}
```

**404 Not Found**

```json
{
  "message": "Product not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "Failed to update product status"
}
```

---

# HTTP Status Codes

| Status Code | Meaning                            |
| ----------- | ---------------------------------- |
| `200`       | Request successful                 |
| `201`       | Resource created successfully      |
| `400`       | Validation error / invalid request |
| `404`       | Resource not found                 |
| `409`       | Conflict, such as duplicate SKU    |
| `500`       | Internal server error              |

# Product Field Rules

### `productType`

Allowed values:

```text
Physical
Digital
```

### `availability`

Allowed values:

```text
Available
Unavailable
```

### `featured`

Boolean:

```json
true
```

or

```json
false
```

### `returnable`

Boolean:

```json
true
```

or

```json
false
```

### `status`

Boolean:

```json
true
```

or

```json
false
```

### `stock`

Must be a non-negative integer.

### `price`

Must be a non-negative number.

### `sku`

SKU is optional, but when provided it must be unique.

# Image Upload

Product image upload uses the form field:

```text
image
```

Supported formats:

```text
JPG
PNG
WEBP
GIF
```

Maximum file size:

```text
5 MB
```

Uploaded files are served from:

```http
GET /uploads/:filename
```

For example:

```text
http://localhost:5000/uploads/product-image.jpg
```
