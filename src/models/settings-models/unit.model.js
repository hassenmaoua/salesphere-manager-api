module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('units', {
    code: {
      type: DataTypes.STRING,
    },
    label: {
      type: DataTypes.STRING,
    },
  });

  return Unit;
};
