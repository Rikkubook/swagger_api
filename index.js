
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./src/swagger/swagger');
const allRouter = require('./src/router/all');
const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use( allRouter);

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
