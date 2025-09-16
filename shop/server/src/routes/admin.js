const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/products', authenticateToken, requireAdmin, adminController.getProducts);
router.post('/products', authenticateToken, requireAdmin, adminController.createProductController);
router.put('/products/:id', authenticateToken, requireAdmin, adminController.updateProductController);
router.delete('/products/:id', authenticateToken, requireAdmin, adminController.deleteProductController);

router.get('/orders', authenticateToken, requireAdmin, adminController.getOrders);
router.put('/orders/:id', authenticateToken, requireAdmin, adminController.changeOrderStatus);

module.exports = router;
