const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;

verifyToken = (req, res, next) => {
  let token =
    req.headers['x-access-token'] || req.headers['authorization'] || '';

  token = token.replace(/^Bearer\s+/, '');

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isSalesAuthorized = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getPermissions().then((permissions) => {
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].name === 'vente') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Sales Permission!',
      });
      return;
    });
  });
};

isPurchasesAuthorized = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getPermissions().then((permissions) => {
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].name === 'achat') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Purchases Permission!',
      });
    });
  });
};

isClientsAuthorized = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getPermissions().then((permissions) => {
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].name === 'client') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Clients Permission!',
      });
    });
  });
};

isSuppliersAuthorized = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getPermissions().then((permissions) => {
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].name === 'fournisseur') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Suppliers Permission!',
      });
    });
  });
};

isProductsAuthorized = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getPermissions().then((permissions) => {
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].name === 'produit') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Products Permission!',
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isSalesAuthorized,
  isPurchasesAuthorized,
  isClientsAuthorized,
  isSuppliersAuthorized,
  isProductsAuthorized,
};
module.exports = authJwt;
