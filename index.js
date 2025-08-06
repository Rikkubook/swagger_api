
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger/swagger');
const allRouter = require('./router/cart');
const authRouter = require('./router/auth');
const app = express();

app.use(express.json());


// 添加 CORS 標頭以防萬一
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/swagger.json', (req, res) => {
  console.log('GET /swagger.json triggered');
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger UI 頁面 - 直接內嵌規格
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cart API Documentation</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
      <style>
        body { 
          margin: 0; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .swagger-ui .topbar { display: none; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          const swaggerSpec = ${JSON.stringify(swaggerSpec)};
          SwaggerUIBundle({
            spec: swaggerSpec,  // 👈 直接使用規格物件，不需要網路請求
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.presets.standalone
            ]
          });
        };
      </script>
    </body>
    </html>
  `);
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRouter);
app.use('/api/cart', allRouter);

app.get('/', (req, res) => {
  res.send(`
    API server is running.<br/>
    請前往 <a href="/api-docs">/api-docs</a> 查看 Swagger 文件。
  `);
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;