module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    style: {
      type: DataTypes.STRING,
    },
  });

  return Status;
};
