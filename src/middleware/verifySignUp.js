const db = require('../models');
const PERMISSIONS = db.PERMISSIONS;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Username
  // User.findOne({
  //   where: {
  //     username: req.body.username,
  //   },
  // }).then((user) => {
  //   if (user) {
  //     res.status(400).send({
  //       message: 'Failed! Username is already in use!',
  //     });
  //     return;
  //   }

  // Email
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Failed! Email is already in use!',
      });
      return;
    }

    next();
  });
};

checkPermissionsExisted = (req, res, next) => {
  if (req.body.permissions) {
    for (let i = 0; i < req.body.permissions.length; i++) {
      if (!PERMISSIONS.includes(req.body.permissions[i])) {
        res.status(400).send({
          message:
            'Failed! Permission does not exist = ' + req.body.permissions[i],
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPermissionsExisted: checkPermissionsExisted,
};

module.exports = verifySignUp;
