const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// =================== PRODUCTS ===================
router.get('/products', authenticateToken, requireAdmin, adminController.getProductController);
router.get('/products/:id', authenticateToken, requireAdmin, adminController.getProductDetailController);
router.post('/products', authenticateToken, requireAdmin, adminController.createProductController);
router.put('/products/:id', authenticateToken, requireAdmin, adminController.updateProductController);
router.delete('/products/:id', authenticateToken, requireAdmin, adminController.deleteProductController);

// =================== COLORS ===================
router.post('/products/:productId/colors', authenticateToken, requireAdmin, adminController.createColorController);
router.put('/colors/:colorId', authenticateToken, requireAdmin, adminController.updateColorController);
router.delete('/colors/:colorId', authenticateToken, requireAdmin, adminController.deleteColorController);

// =================== SIZES ===================
router.post('/colors/:colorId/sizes', authenticateToken, requireAdmin, adminController.createSizeController);
router.put('/sizes/:sizeId', authenticateToken, requireAdmin, adminController.updateSizeController);
router.delete('/sizes/:sizeId', authenticateToken, requireAdmin, adminController.deleteSizeController);

// =================== ORDERS ===================
router.get('/orders', authenticateToken, requireAdmin, adminController.getOrders);
router.put('/orders/:id', authenticateToken, requireAdmin, adminController.changeOrderStatus);

// =================== BANNERS ===================
router.get('/banners', authenticateToken, requireAdmin, adminController.getBannerController);
router.post('/banners', authenticateToken, requireAdmin, adminController.createBannerController);
router.put('/banners/:id', authenticateToken, requireAdmin, adminController.updateBannerController);
router.delete('/banners/:id', authenticateToken, requireAdmin, adminController.deleteBannerController);

// =================== CATEGORIES ===================
router.get('/categories', authenticateToken, requireAdmin, categoryController.getCategories);
router.post('/categories', authenticateToken, requireAdmin, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, requireAdmin, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, requireAdmin, categoryController.deleteCategory);


module.exports = router;
