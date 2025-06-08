# ClipKart - Marketplace API

A simple e-commerce marketplace API where buyers and sellers can interact. Built with Node.js.

**Base URL:** `http://localhost:8000`

## Quick Start

```bash
npm install
node app.js
```

## API Endpoints

### Buyer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page with products (optional: `?page=4`) |
| `POST` | `/register` | Register new buyer |
| `POST` | `/login` | Buyer login |
| `POST` | `/order` | Place new order |
| `POST` | `/cancle` | Cancel order |
| `GET` | `/orders` | Get buyer's orders |

#### Register Buyer
```bash
POST /register
Form data: user_name (string), mo_no (string), address (string), password (string)
```

#### Login
```bash
POST /login
Form data: mo_no (string), password (string)
```

#### Place Order
```json
POST /order
{
  "order": [
    {
      "seller_id": 328609,
      "sku_id": "juliet_heat-resistant_silicone_mat",
      "quantity": 1
    }
  ]
}
```

#### Cancel Order
```json
POST /cancle
{
  "cancel": ["CF-9wmymv1"]
}
```

### Seller Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/seller/register` | Register new seller |
| `POST` | `/seller/login` | Seller login |
| `POST` | `/seller/list-product` | Add new product |
| `GET` | `/seller/products` | Get seller's products |
| `POST` | `/seller/modify-products` | Update product |
| `GET` | `/seller/orders` | Get seller's orders |
| `POST` | `/seller/process-orders` | Mark orders as processed |
| `GET` | `/seller/sales` | Get sales data |

#### Register Seller
```bash
POST /seller/register
Form data: seller_name (string), mo_no (string), gst_no (string), password (string)
```

#### Login
```bash
POST /seller/login
Form data: mo_no (string), password (string)
```

#### Add Product
```bash
POST /seller/list-product
Form data: sku_id (string), product_name (string), description (string), 
          price (number), stock (number), product (file - multiple images)
```

#### Modify Product
```bash
POST /seller/modify-products
Form data: sku_id (string), product_name (string), description (string),
          price (number), stock (number), activation_status (boolean)
```

#### Process Orders
```json
POST /seller/process-orders
{
  "orders": ["CF-ffz93r7"]
}
```

## Project Structure

```
ClipKart/
├── controllers/      # Route handlers
├── middlewares/      # JWT, Multer middleware
├── models/          # Database models
├── routers/         # Route definitions
├── testing data/    # Sample data files
├── uploads/         # File uploads
├── app.js          # Main server file
├── utilities.js    # Helper functions
└── package.json    # Dependencies
```

## Testing Data

Sample data in `testing data/` folder: users, sellers, products.

## Author

**Harsh Lakhani**  
GitHub: [@harsh-lakhani-3h](https://github.com/harsh-lakhani-3h)