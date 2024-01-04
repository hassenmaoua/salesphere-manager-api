const { Op } = require('sequelize');

const padNumber = (num, size) => {
  const padded = `000000${num}`.slice(-size);
  return padded;
};

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('documents', {
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    stamp: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    note: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Document.beforeCreate(async (document) => {
    const { code } = document;
    const date = new Date();

    // Set hours, minutes, seconds, and milliseconds to zero to compare only the date part
    date.setHours(0, 0, 0, 0);

    const count = await Document.count({
      where: {
        [Op.and]: [
          {
            code,
          },
          {
            createdAt: {
              [Op.gte]: date,
            },
          },
        ],
      },
    });

    if (code === 'FV') {
      document.stamp = 1;
    }

    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1, 2);
    const day = padNumber(date.getDate(), 2);

    document.reference = `${code}-${year}${month}${day}-${padNumber(
      count + 1,
      2
    )}`;
  });

  return Document;
};
