const swaggerJsdoc = require('swagger-jsdoc');


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cart API',
      version: '1.0.0',
      description: `
這是一份面試用 API，請用下方測試帳號登入：(已建立購物車-商品 以方便模擬面試作品)

email: betty@gmail.com

password: betty123 

token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YThmZmY2MS03ZTk4LTQyM2EtYjA3Zi00M2VhZDgzMTJkNjMiLCJlbWFpbCI6ImJldHR5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDAzNTc4NCwiZXhwIjoxNzU0NjQwNTg0fQ.jZl4mnTl-bD2voC6HjoSZiwN2eAjU_jE7DOoaejJU3Q

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

//pis: [__dirname + '/../router/*.js'],

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
