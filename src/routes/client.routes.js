const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const clientController = require('../controllers/client.controller');

// Create a new client
router.post(
  '/clients',
  [authJwt.verifyToken, authJwt.isClientsAuthorized],
  clientController.createClient
);

// Get clients with pagination, sorting, and searching
router.get(
  '/clients',
  [authJwt.verifyToken, authJwt.isClientsAuthorized],
  clientController.getClients
);

// Get all clients
router.get(
  '/all-clients',
  [authJwt.verifyToken],
  clientController.getAllClients
);

// Get a single client by ID
router.get(
  '/clients/:clientId',
  [authJwt.verifyToken, authJwt.isClientsAuthorized],
  clientController.getClientById
);

// Update a client by ID
router.put(
  '/clients/:clientId',
  [authJwt.verifyToken, authJwt.isClientsAuthorized],
  clientController.updateClientById
);

// Delete a client by ID
router.post(
  '/clients/:clientId',
  [authJwt.verifyToken, authJwt.isClientsAuthorized],
  clientController.archiveClientById
);

// Route for exporting to Excel and allowing file download
router.get(
  '/export-clients',
  [authJwt.verifyToken, authJwt.isClientsAuthorized],
  clientController.exportToExcel
);

// Retrive Top 3 clients by salles
router.get(
  '/top-clients',
  [authJwt.verifyToken],
  clientController.getTopClients
);

module.exports = router;
