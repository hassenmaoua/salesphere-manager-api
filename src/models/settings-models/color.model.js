module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define('colors', {
    label: {
      type: DataTypes.STRING,
    },
    hexCode: {
      type: DataTypes.STRING(6),
    },
  });

  return Color;
};
