const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cart API',
      version: '1.0.0',
      description: `
這是一份面試用 API，請用下方測試帳號登入：
email: betty@gmail.com
password: betty123 (以建立購物車API)

如需註冊請用 /register，登入請用 /login，購物車 API 需帶 JWT token。
      `,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [__dirname + '/../router/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
