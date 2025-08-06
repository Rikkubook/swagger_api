
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger/swagger');
const allRouter = require('./router/cart');
const authRouter = require('./router/auth');
const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRouter);
app.use('/api/cart', allRouter);

// const PORT = process.env.PORT || 3100;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
// });

module.exports = app;