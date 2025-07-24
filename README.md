# Node.js Express Cart API

This project provides a cart API built with Express and documented using Swagger.

## Features
- Express server
- Swagger UI for API documentation
- Cart endpoints (add, remove, list items)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node index.js
   ```
3. Visit Swagger UI at `http://localhost:3000/api-docs`

## API Endpoints
- `GET /cart` - List cart items
- `POST /cart` - Add item to cart
- `DELETE /cart/:id` - Remove item from cart

## License
MIT
