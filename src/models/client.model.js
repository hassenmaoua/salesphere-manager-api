const padNumber = (num, size) => {
  const padded = `000000${num}`.slice(-size);
  return padded;
};

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'clients',
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
      isExempt: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      exemptNumber: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.isExempt;
        },
        validate: {
          checkExemptNumber() {
            if (this.isExempt && !this.exemptNumber) {
              throw new Error(
                'Exempt number is required when isExempt is true'
              );
            }
          },
        },
      },
      exemptExpiration: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.isExempt;
        },
        validate: {
          checkExemptExpiration() {
            if (this.isExempt && !this.exemptExpiration) {
              throw new Error(
                'Exempt expiration is required when isExempt is true'
              );
            }
          },
        },
      },
      taxNumber: {
        type: DataTypes.STRING(30),
        allowNull: function () {
          return !this.isExempt;
        },
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

  Client.beforeCreate(async (client) => {
    const count = await Client.count();
    client.reference = 'CL-' + padNumber(count + 1, 4);
  });

  return Client;
};
