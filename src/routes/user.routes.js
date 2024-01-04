const { authJwt } = require('../middleware');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create User
router.post('/users', [authJwt.verifyToken], userController.createUser);

// Get users with pagination, sorting, and searching
router.get('/users', [authJwt.verifyToken], userController.getUsers);

// Get all users
router.get('/all-users', [authJwt.verifyToken], userController.getAllUsers);

// Get a single user by ID
router.get('/users/:userId', [authJwt.verifyToken], userController.getUserById);

// Update a user by ID
router.put(
  '/users/:userId',
  [authJwt.verifyToken],
  userController.updateUserById
);

// Delete a user by ID
router.post(
  '/users/:userId',
  [authJwt.verifyToken],
  userController.activateUserById
);

// Route for exporting to Excel and allowing file download
router.get(
  '/export-users',
  [authJwt.verifyToken],
  userController.exportToExcel
);

module.exports = router;
