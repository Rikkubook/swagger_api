const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cart API',
      version: '1.0.0',
       description: 'API documentation for my system', 
    },
  },
  apis: [__dirname + '/../router/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
