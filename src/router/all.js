const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const authMiddleware = require('../middlewares/authMiddleware');


/**
 * @swagger
 * /api/cart/shoppingCart:
 *   get:
 *     summary: Get shipping cart by JWT token
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # 這支需要驗證
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart_id:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                 cart_items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       productName:
 *                         type: string
 *                       skuId:
 *                         type: string
 *                       skuName:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                       subtotal:
 *                         type: number
 *                       imageUrl:
 *                         type: string
 *                 total:
 *                   type: number
 *                 grandTotal:
 *                   type: number
 */
router.get('/shoppingCart', authMiddleware, cartController.getShoppingCart);

/**
 * @swagger
 * /api/cart/shoppingCart:
 *   patch:
 *     summary: Update item quantity in shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skuId:
 *                 type: string
 *                 description: SKU ID of the product
 *               quantity:
 *                 type: integer
 *                 description: New quantity
 *             required:
 *               - skuId
 *               - quantity
 *           example:
 *             skuId: "208456c3-a6ad-47f8-a999-c83edc3c4eb9"
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Cart item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart_id:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to update cart item
 */
router.patch('/shoppingCart', authMiddleware, cartController.changeShoppingCart);


module.exports = router;
