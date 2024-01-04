module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'company',
    {
      nom: {
        type: DataTypes.STRING(100),
        defaultValue: '',
      },
      logo: {
        type: DataTypes.STRING(),
        defaultValue: '',
      },
      fiscalCode: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(100),
        defaultValue: 'TND',
      },
      email: {
        type: DataTypes.STRING(100),
        defaultValue: '',
      },
      mobile: {
        type: DataTypes.STRING(15),
        defaultValue: '',
      },

      phone: {
        type: DataTypes.STRING(15),
        defaultValue: '',
      },

      address: {
        type: DataTypes.STRING(100),
        defaultValue: '',
      },

      country: {
        type: DataTypes.STRING(2),
        defaultValue: 'TN',
      },
    },
    {}
  );

  return Company;
};
