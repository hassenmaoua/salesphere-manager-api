const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Bearer, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/api/auth/register',
    [verifySignUp.checkDuplicateEmail, verifySignUp.checkPermissionsExisted],
    controller.signup
  );

  app.post('/api/auth/login', controller.signin);

  app.post('/api/auth/verify-token', controller.getUserByToken);

  app.post('/db-init', controller.initialize);

  app.post('/db-inject', controller.inject);
};
