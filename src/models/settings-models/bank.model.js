module.exports = (sequelize, Sequelize) => {
  const Bank = sequelize.define('banks', {
    bankName: {
      type: Sequelize.STRING,
    },
    label: {
      type: Sequelize.STRING,
    },
    agency: {
      type: Sequelize.STRING,
    },
    swift: {
      type: Sequelize.STRING,
    },
    IBAN: {
      type: Sequelize.STRING,
    },
  });

  return Bank;
};
