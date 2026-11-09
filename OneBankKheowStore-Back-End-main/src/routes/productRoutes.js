// Route URL APi
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');

// router for search product
router.get('/search', productController.searchProducts);

// admin router for manage product
router.get('/admin', verifyToken, productController.getAllProducts);
router.get('/admin/:productID', verifyToken, productController.getProductById);
router.post('/admin', verifyToken, productController.createProduct);
router.put('/admin/:productID', verifyToken, productController.updateProduct);
router.delete('/admin/:productID', verifyToken, productController.deleteProduct);

// router for exchange rate (THB to CNY)
router.get('/exchange-rate', productController.getExchangeRate);

// router for recommended products (random)
router.get('/recommend', productController.getRecommendedProducts);

// router for get product detail
router.get('/:productID', productController.getProductDetail);

 
module.exports = router;
