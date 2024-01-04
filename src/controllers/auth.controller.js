const db = require('../models');
const config = require('../config/auth.config');
const Sequelize = require('sequelize');
const User = db.user;
const Permission = db.permission;

const Op = Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { injectExamplesData, initializeDatabase } = require('../config/init-db');

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.permissions) {
        Permission.findAll({
          where: {
            name: {
              [Op.or]: req.body.permissions,
            },
          },
        }).then((permissions) => {
          user.setPermissions(permissions).then(() => {
            res.send({ message: 'User was registered successfully!' });
          });
        });
      } else {
        // user permission = 1
        user.setPermissions([1]).then(() => {
          res.send({ message: 'User was registered successfully!' });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  const { email } = req.body;

  User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        api_token: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });

      throw err;
    });
};

exports.getUserByToken = (req, res) => {
  const { token } = req.body; // You should get the token from the request
  console.log(token);

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Failed to authenticate token' });
    }

    const userId = decoded.id;

    User.findByPk(userId)
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
        const company = await db.company.findOne();

        var authorities = [];
        user.getPermissions().then((permissions) => {
          for (let i = 0; i < permissions.length; i++) {
            authorities.push(permissions[i].name.toUpperCase() + '_PERMISSION');
          }
          res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            permissions: user.authorities, // You should include the user's permissions here
            company,
          });
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};

exports.initialize = (req, res) => {
  try {
    initializeDatabase();
    return res
      .status(200)
      .send({ message: 'Database initialization completed.' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err.message });
  }
};

exports.inject = (req, res) => {
  try {
    injectExamplesData();
    return res
      .status(200)
      .send({ message: 'Database examples injection completed.' });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};
