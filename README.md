# MERN Product & Category Management Application

## Project Overview

This project is a full-stack product and category management application built using the MERN-style architecture with React on the frontend and Node.js/Express.js on the backend.

The application allows users to manage product categories and products through a simple web interface. Product images can be uploaded and stored on the backend, while product and category data are persisted in a MySQL database using Sequelize ORM.

## Features

### Category Management

* Create a new category
* View all categories
* View a category by ID
* Edit an existing category
* Delete a category
* Activate or deactivate a category

### Product Management

* Create a new product
* View all products
* View product details
* Edit product information
* Delete products
* Update product stock separately
* Activate or deactivate a product
* Search products by name or SKU
* Filter products by category
* Pagination for product listing
* Upload product images
* Product image preview before upload
* Featured product option
* Returnable product option
* Physical/Digital product type
* Available/Unavailable product status
* Available date support

## Technology Stack

### Frontend

* React 19
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Sequelize ORM
* MySQL
* Multer
* CORS
* dotenv

## Project Structure

```text
mern assesment/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── categoryController.js
│   │   └── productController.js
│   │
│   ├── models/
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Categories.jsx
│   │   │   ├── CreateProduct.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   └── Products.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── API.md
│
└── README.md
```

## Prerequisites

Make sure the following are installed:

* Node.js 18+ recommended
* npm
* MySQL 8+ recommended
* Git (optional)

## Database Setup

Create a MySQL database named:

```sql
CREATE DATABASE mern_assessment;
```

The backend uses Sequelize with MySQL.

Configure the database connection using the environment variables described below.

The current Sequelize configuration connects using:

* Host: `localhost`
* Port: `3306`
* Database: `mern_assessment`
* User: `root`

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DB_NAME=mern_assessment
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

Replace `your_mysql_password` with the password of your MySQL user.

> Do not commit `.env` files containing real database credentials to a public repository.

## Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
node server.js
```

The backend API will run at:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

### Backend Development

`nodemon` is included as a development dependency. The backend can also be started with:

```bash
npx nodemon server.js
```

## Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The frontend communicates with the backend using:

```text
http://localhost:5000/api
```

## Running the Application

### Step 1: Start MySQL

Make sure the MySQL server is running and the `mern_assessment` database exists.

### Step 2: Start Backend

```bash
cd backend
npm install
node server.js
```

The terminal should show a successful database connection followed by:

```text
Server running on port 5000
```

### Step 3: Start Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL displayed by Vite, usually:

```text
http://localhost:5173
```

## Application Routes

| Route                | Description          |
| -------------------- | -------------------- |
| `/products`          | Product listing      |
| `/products/new`      | Create a new product |
| `/products/:id`      | View product details |
| `/products/:id/edit` | Edit a product       |
| `/categories`        | Manage categories    |

The root route `/` redirects to `/products`.

## API Documentation

Detailed API documentation is available in:

```text
docs/API.md
```

### API Base URL

```text
http://localhost:5000/api
```

### Category Endpoints

```text
POST   /categories
GET    /categories
GET    /categories/:id
PUT    /categories/:id
DELETE /categories/:id
PATCH  /categories/:id/status
```

### Product Endpoints

```text
POST   /products
GET    /products
GET    /products/:id
PUT    /products/:id
DELETE /products/:id
PATCH  /products/:id/stock
PATCH  /products/:id/status
```

## Image Upload

Product images are uploaded using `multipart/form-data`.

The backend accepts:

* JPG/JPEG
* PNG
* WEBP
* GIF

Maximum image size:

```text
5 MB
```

Uploaded images are stored in the backend `uploads` directory and are served through:

```text
http://localhost:5000/uploads/<filename>
```

## Data Models

### Category

| Field       | Type    | Description            |
| ----------- | ------- | ---------------------- |
| `id`        | Integer | Primary key            |
| `name`      | String  | Category name          |
| `status`    | Boolean | Active/inactive status |
| `createdAt` | Date    | Creation timestamp     |
| `updatedAt` | Date    | Last update timestamp  |

### Product

| Field           | Type    | Description                  |
| --------------- | ------- | ---------------------------- |
| `id`            | Integer | Primary key                  |
| `name`          | String  | Product name                 |
| `sku`           | String  | Unique product SKU           |
| `description`   | Text    | Product description          |
| `price`         | Decimal | Product price                |
| `stock`         | Integer | Available stock              |
| `categoryId`    | Integer | Associated category ID       |
| `featured`      | Boolean | Featured product flag        |
| `returnable`    | Boolean | Returnable product flag      |
| `productType`   | Enum    | `Physical` or `Digital`      |
| `availability`  | Enum    | `Available` or `Unavailable` |
| `availableDate` | Date    | Product availability date    |
| `imageUrl`      | String  | Uploaded image path          |
| `status`        | Boolean | Active/inactive status       |
| `createdAt`     | Date    | Creation timestamp           |
| `updatedAt`     | Date    | Last update timestamp        |

## Validation

The backend validates the following product fields:

* Product name is required
* Price must be a valid non-negative number
* Stock must be a valid non-negative integer
* Category is required
* Selected category must exist
* SKU must be unique when provided

Category validation requires a category name.

## Error Handling

The API returns appropriate HTTP status codes such as:

* `200` - Successful request
* `201` - Resource created successfully
* `400` - Invalid request or validation error
* `404` - Resource not found
* `409` - Conflict, such as duplicate SKU
* `500` - Internal server error

## Notes

* CORS is enabled on the backend.
* Product images are handled using Multer.
* Sequelize is used as the ORM for MySQL.
* Product listing supports search, category filtering, and pagination.
* Product and category status can be changed independently.
* The backend currently authenticates the database connection on startup.
* Database schema synchronization is currently disabled in `server.js`; existing database tables should therefore be created/configured before running the application.
