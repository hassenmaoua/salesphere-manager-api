module.exports = (sequelize, DataTypes) => {
  const DocumentItem = sequelize.define('document_items', {
    description: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });

  return DocumentItem;
};
