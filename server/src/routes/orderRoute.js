// routes/ordersRoute.js
const express = require('express');
const router = express.Router();
const { createOrderController, getOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createOrderController);
router.get('/', authenticateToken, getOrders);

module.exports = router;
