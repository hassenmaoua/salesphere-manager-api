const padNumber = (num, size) => {
  const padded = `000000${num}`.slice(-size);
  return padded;
};

module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    'suppliers',
    {
      type: {
        type: DataTypes.ENUM('individual', 'professional'),
        defaultValue: 'professional',
      },
      reference: {
        type: DataTypes.STRING,
        defaultValue: '',
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      taxNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      register: {
        type: DataTypes.STRING(50),
        defaultValue: '',
      },
      website: {
        type: DataTypes.STRING(100),
        defaultValue: '',
      },
      email: {
        type: DataTypes.STRING(100),
        defaultValue: '',
      },
      mobile: {
        type: DataTypes.STRING(15),
      },
      phone: {
        type: DataTypes.STRING(15),
      },
      address: {
        type: DataTypes.STRING(200),
      },
      city: {
        type: DataTypes.STRING(20),
      },
      postalCode: {
        type: DataTypes.STRING(10),
      },
      country: {
        type: DataTypes.STRING(2),
        defaultValue: 'TN',
      },
      revenue: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  );

  Supplier.beforeCreate(async (supplier) => {
    const count = await Supplier.count();
    supplier.reference = 'FR-' + padNumber(count + 1, 4);
  });

  return Supplier;
};
