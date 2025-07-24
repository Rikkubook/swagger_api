const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cart API',
      version: '1.0.0',
       description: 'API documentation for my system', // ✅ info 物件是必填！
    },
  },
  apis: [__dirname + '/../router/*.js'], // ✅ 修正這裡！
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
