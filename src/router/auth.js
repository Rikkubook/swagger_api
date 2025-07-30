const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - checkPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               checkPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 註冊成功
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: 驗證失敗或欄位錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email 格式錯誤
 */

router.post('/register', [
    body('email')
      .notEmpty().withMessage('Email 不可為空')
      .isEmail().withMessage('Email 格式錯誤'),
    body('password')
      .notEmpty().withMessage('密碼不可為空')
      .isLength({ min: 6 }).withMessage('密碼至少需 6 碼'),
    body('checkPassword')
      .notEmpty().withMessage('確認密碼不可為空')
      .isLength({ min: 6 }).withMessage('確認密碼至少需 6 碼'),
  ],authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */
router.post('/login', authController.login);

module.exports = router;