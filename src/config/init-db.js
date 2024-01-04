const db = require('../models');
const sequelize = require('./database');

const Company = db.company;
const User = db.user;
const Permission = db.permission;
const UserPermission = db.userPermission;
const Category = db.category;
const Color = db.color;
const Unit = db.unit;
const Vat = db.vat;
const Status = db.status;

const Client = db.client;
const Supplier = db.supplier;
const Product = db.product;

// Static data
const users = require('./static-data/user.data');
const permissions = require('./static-data/permission.data');
const userPermissions = require('./static-data/userPermissions.data');
const categories = require('./static-data/category.data');
const colors = require('./static-data/color.data');
const units = require('./static-data/unit.data');
const vats = require('./static-data/vat.data');
const status = require('./static-data/status.data');
const company = require('./static-data/company.data');

// Example data
const clientData = require('./example-data/clients.data');
const supplierData = require('./example-data/supplier.data');
const productData = require('./example-data/product.data');

// Function to initialize the database with testing data
async function initializeDatabase() {
  try {
    // Drop and re-sync the database (using { force: true })
    await sequelize.sync({ force: true });
    console.log('Database tables dropped and re-synced.');

    await Company.bulkCreate(company);
    console.log('Company created.');

    // Create users
    await User.bulkCreate(users);
    console.log('Users created.');

    // Create permissions
    await Permission.bulkCreate(permissions);
    console.log('Permissions created.');

    await UserPermission.bulkCreate(userPermissions);
    console.log('User Permissions created.');

    // Create categories
    await Category.bulkCreate(categories);
    console.log('Categories created.');

    // Create colors
    await Color.bulkCreate(colors);
    console.log('Colors created.');

    // Create units
    await Unit.bulkCreate(units);
    console.log('Units created.');

    // Create VATs
    await Vat.bulkCreate(vats);
    console.log('VATs created.');

    // Create status
    await Status.bulkCreate(status);
    console.log('Statuses created.');

    console.log('Database initialization completed.');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    // Close the database connection (if needed)
    // await db.sequelize.close();
  }
}

async function injectExamplesData() {
  try {
    // Create clients examples
    await Client.bulkCreate(clientData);
    console.log('Clients created.');

    // Create suppliers examples
    await Supplier.bulkCreate(supplierData);
    console.log('Suppliers created.');

    // Create products examples
    await Product.bulkCreate(productData);
    console.log('Products created.');

    console.log('Database injection completed.');
  } catch (error) {
    console.error('Database injection error:', error);
  } finally {
    // Close the database connection (if needed)
    // await db.sequelize.close();
  }
}
module.exports = { initializeDatabase, injectExamplesData };
