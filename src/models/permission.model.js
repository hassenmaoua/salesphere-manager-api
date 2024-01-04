module.exports = (sequelize, Sequelize) => {
  const Permission = sequelize.define('permissions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    code: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  });

  return Permission;
};
