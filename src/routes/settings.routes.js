const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const categoryController = require('../controllers/settings.controller');
const colorController = require('../controllers/settings.controller');
const statusController = require('../controllers/settings.controller');
const vatController = require('../controllers/settings.controller');
const unitController = require('../controllers/settings.controller');

// Create a new category
router.post(
  '/categories',
  [authJwt.verifyToken],
  categoryController.createCategory
);

// Get all categories
router.get(
  '/categories',
  [authJwt.verifyToken],
  categoryController.getAllCategories
);

// Get a single category by ID
router.get(
  '/categories/:categoryId',
  [authJwt.verifyToken],
  categoryController.getCategoryById
);

// Update a category by ID
router.put(
  '/categories/:categoryId',
  [authJwt.verifyToken],
  categoryController.updateCategoryById
);

// Create a new color
router.post('/colors', [authJwt.verifyToken], colorController.createColor);

// Get all colors
router.get('/colors', [authJwt.verifyToken], colorController.getAllColors);

// Get a single color by ID
router.get(
  '/colors/:colorId',
  [authJwt.verifyToken],
  colorController.getColorById
);

// Update a color by ID
router.put(
  '/colors/:colorId',
  [authJwt.verifyToken],
  colorController.updateColorById
);

// Get all statuses
router.get('/statuses', [authJwt.verifyToken], statusController.getAllStatuses);

// Get a single color by ID
router.get(
  '/statuses/:statusId',
  [authJwt.verifyToken],
  statusController.getStatusById
);

// Get all vats
router.get('/vats', [authJwt.verifyToken], vatController.getAllVats);

// Get a single vat by ID
router.get('/vats/:vatId', [authJwt.verifyToken], vatController.getVatById);

// Get all units
router.get('/units', [authJwt.verifyToken], unitController.getAllUnits);

// Get a single unit by ID
router.get('/units/:unitId', [authJwt.verifyToken], unitController.getUnitById);

module.exports = router;
