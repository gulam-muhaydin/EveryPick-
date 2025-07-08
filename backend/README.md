# Order Tracker Backend

This is a simple Node.js backend for tracking orders received from your website.

## Features
- Add new orders
- List all orders
- View a single order
- Update order status
- Stores data in a local JSON file (no database required)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The backend will run at [http://localhost:3001](http://localhost:3001)

## API Endpoints
- `GET    /api/orders`           — List all orders
- `POST   /api/orders`           — Add a new order (JSON: customerName, items[], total, status?)
- `GET    /api/orders/:id`       — Get one order by ID
- `PATCH  /api/orders/:id`       — Update order status (JSON: status)

## Example Order Object
```
{
  "id": 1720471050000,
  "customerName": "John Doe",
  "items": ["Product 1", "Product 2"],
  "total": 1999.99,
  "status": "pending",
  "createdAt": "2025-07-07T20:37:32.000Z"
}
```

---
Feel free to extend this backend or connect it to your website's frontend as needed.
