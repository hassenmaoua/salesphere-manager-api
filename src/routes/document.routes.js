const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const documentController = require('../controllers/document.controller');

// Create a new document
router.post(
  '/document',
  [authJwt.verifyToken],
  documentController.createDocument
);

// Get a document by ID
router.get(
  '/documents/:documentId',
  [authJwt.verifyToken],
  documentController.getDocumentById
);

// Get documents with pagination, sorting, and searching
router.get(
  '/documents',
  [authJwt.verifyToken],
  documentController.getDocuments
);

// Get documents logistics informations
router.get(
  '/document-logistics',
  [authJwt.verifyToken],
  documentController.getLogisticsInformations
);

// Update Document Status
router.put(
  '/document/:documentId/:code',
  [authJwt.verifyToken],
  documentController.updateDocumentStatus
);

// Get documents logistics informations
router.get(
  '/sales-dashboard',
  [authJwt.verifyToken],
  documentController.getSalesDashboardData
);

// Get documents logistics informations
router.get(
  '/sales-total-dashboard',
  [authJwt.verifyToken],
  documentController.getSalesTotalsPerMonth
);

// Get top sold products this month
router.get(
  '/top-products',
  [authJwt.verifyToken],
  documentController.getTopProducts
);

module.exports = router;
