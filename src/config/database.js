const Sequelize = require('sequelize');

class DatabaseSingleton {
  constructor() {
    if (!DatabaseSingleton.instance) {
      // Create and configure the Sequelize instance
      this.sequelize = new Sequelize(process.env.DATABASE_URL, {
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

      // Set up any additional configurations or associations here

      // Save the instance for future use
      DatabaseSingleton.instance = this;
    }

    // Return the singleton instance
    return DatabaseSingleton.instance;
  }
}

// Export the singleton instance
const databaseSingleton = new DatabaseSingleton();
module.exports = databaseSingleton.sequelize;
