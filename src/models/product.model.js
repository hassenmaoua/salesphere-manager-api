module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'product',
    {
      code: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      minStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      maxStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      allowManufactureEmpty: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {}
  );

  return Product;
};
