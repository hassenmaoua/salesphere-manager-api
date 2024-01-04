module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    name: {
      type: Sequelize.STRING,
    },
    position: {
      type: Sequelize.STRING,
      defaultValue: 'user',
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return User;
};
