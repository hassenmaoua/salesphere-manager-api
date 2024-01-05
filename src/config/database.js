const Sequelize = require('sequelize');

// Create and configure the Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  pool: {
    max: Number(process.env.POOL_MAX),
    min: Number(process.env.POOL_MIN),
    port: Number(process.env.POOL_PORT),
    acquire: process.env.POOL_ACQUIRE,
    idle: process.env.POOL_IDLE,
  },
  ssl: {
    cert: process.env.SSL_CERT_DAYS,
    rejectUnauthorized: false, // Adjust based on your server's SSL configuration
  },
});

module.exports = sequelize;
