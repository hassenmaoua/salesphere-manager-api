module.exports = (sequelize, DataTypes) => {
  const Vat = sequelize.define('vats', {
    sign: {
      type: DataTypes.ENUM('+', '-'),
      defaultValue: '+',
    },

    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Vat;
};
