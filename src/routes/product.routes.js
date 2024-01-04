const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const productController = require('../controllers/product.controller');

// Create a new product
router.post(
  '/products',
  [authJwt.verifyToken, authJwt.isProductsAuthorized],
  productController.createProduct
);

// Get products with pagination, sorting, and searching
router.get(
  '/products',
  [authJwt.verifyToken, authJwt.isProductsAuthorized],
  productController.getProducts
);

// Get products with pagination, sorting, and searching
router.get(
  '/all-products',
  [authJwt.verifyToken],
  productController.getAllProducts
);

// Get a single product by ID
router.get(
  '/products/:productId',
  [authJwt.verifyToken, authJwt.isProductsAuthorized],
  productController.getProductById
);

// Update a product by ID
router.put(
  '/products/:productId',
  [authJwt.verifyToken, authJwt.isProductsAuthorized],
  productController.updateProductById
);

// Archive product by ID
router.post(
  '/products/:productId',
  [authJwt.verifyToken, authJwt.isProductsAuthorized],
  productController.archiveProductById
);

// Route for exporting to Excel and allowing file download
router.get(
  '/export-products',
  [authJwt.verifyToken, authJwt.isProductsAuthorized],
  productController.exportToExcel
);

router.get(
  '/stock-movement-products/:productId',
  [authJwt.verifyToken, authJwt.isProductsAuthorized],
  productController.getStockMovement
);

module.exports = router;
