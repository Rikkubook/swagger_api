# Node.js Express Cart API

This project provides a cart API built with Express and documented using Swagger.

## 技術棧 (Tech Stack)

- **Node.js**：JavaScript 執行環境
- **Express**：Web 應用框架
- **Swagger (swagger-jsdoc, swagger-ui-express)**：API 文件自動產生與 UI
- **Supabase**：雲端資料庫服務 (PostgreSQL)
- **JWT (jsonwebtoken)**：用於登入驗證與授權
- **Cookie-Parser**：處理 HTTP cookie
- **dotenv**：環境變數管理
- **bcryptjs**：密碼雜湊（如有使用）

## Features
- Express server
- Swagger UI for API documentation
- Cart endpoints (add, remove, list items)
- JWT + Cookie 登入驗證
- 註冊 API
- 以 token 取得個人購物車

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
- `POST /register` - User registration
- `POST /login` - User login (returns JWT in cookie)
- `GET /cart` - List cart items
- `GET /cart/shippingCart` - Get cart by token
- `POST /cart` - Add item to cart
- `DELETE /cart/:id` - Remove item from cart

## License
MIT
  "email": "betty@gmail.com",
  "password": "betty123"