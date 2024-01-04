module.exports = (sequelize, Sequelize) => {
  const UserPermission = sequelize.define('user_permissions', {});

  return UserPermission;
};
