const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const supplierController = require('../controllers/supplier.controller');

// Create a new supplier
router.post(
  '/suppliers',
  [authJwt.verifyToken, authJwt.isSuppliersAuthorized],
  supplierController.createSupplier
);

// Get suppliers with pagination, sorting, and searching
router.get(
  '/suppliers',
  [authJwt.verifyToken, authJwt.isSuppliersAuthorized],
  supplierController.getSuppliers
);

// Get all suppliers
router.get(
  '/all-suppliers',
  [authJwt.verifyToken],
  supplierController.getAllSuppliers
);

// Get a single supplier by ID
router.get(
  '/suppliers/:supplierId',
  [authJwt.verifyToken, authJwt.isSuppliersAuthorized],
  supplierController.getSupplierById
);

// Update a supplier by ID
router.put(
  '/suppliers/:supplierId',
  [authJwt.verifyToken, authJwt.isSuppliersAuthorized],
  supplierController.updateSupplierById
);

// Delete a supplier by ID
router.post(
  '/suppliers/:supplierId',
  [authJwt.verifyToken, authJwt.isSuppliersAuthorized],
  supplierController.archiveSupplierById
);

// Route for exporting to Excel and allowing file download
router.get(
  '/export-suppliers',
  [authJwt.verifyToken, authJwt.isSuppliersAuthorized],
  supplierController.exportToExcel
);

module.exports = router;
