const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * /api/cart/shoppingCart:
 *   get:
 *     summary: Get shipping cart by JWT token
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # 這支需要驗證
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: []
 *                 total:
 *                   type: number
 *                 grandTotal:
 *                   type: number
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
 *       400:
 *         description: 驗證失敗或欄位錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   example: badRequest
 *                 message:
 *                   type: string
 *                   example: 缺少 userId
 *       500:
 *         description: 系統錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   example: createCartFailed
 *                 message:
 *                   type: string
 *                   example: 取得購物車失敗，請稍後再試
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
 *       400:
 *         description: 驗證失敗或欄位錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   example: badRequest
 *                 message:
 *                   type: string
 *                   example: 缺少 userId
 *       404:
 *         description: 找不到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   example: cartNotFound
 *                 message:
 *                   type: string
 *                   example: 查無購物車
 *       500:
 *         description: 系統錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   example: createCartFailed
 *                 message:
 *                   type: string
 *                   example: 更新購物車失敗，請稍後再試
 */
router.patch('/shoppingCart', [
    body('skuId')
      .notEmpty().withMessage('skuId 不可為空'), 
    body('quantity')
      .isInt({ min: 0 }).withMessage('quantity 必須為大於等於 0 的整數')
],authMiddleware, cartController.changeShoppingCart);


module.exports = router;
