const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');


/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all cart items
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   quantity:
 *                     type: integer
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /shopping:
 *   get:
 *     summary: Get shipping cart by userId
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to fetch cart
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
router.get('/shoppingCart', cartController.getShoppingCart);

/**
 * @swagger
 * /shopping:
 *   post:
 *     summary: Get shipping cart by userId
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to fetch cart
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
router.post('/shoppingCart', cartController.getShoppingCart);


module.exports = router;
