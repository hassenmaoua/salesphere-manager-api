const Sequelize = require('sequelize');
const seq = require('../config/database.js');
const db = {};

// Load user and permissions models
db.user = require('./user.model.js')(seq, Sequelize);
db.permission = require('./permission.model.js')(seq, Sequelize);

db.userPermission = require('./userPermission.model.js')(seq, Sequelize);

// Load company model
db.company = require('./settings-models/company.model.js')(seq, Sequelize);

// Load clients and suppliers models
db.client = require('./client.model.js')(seq, Sequelize);
db.client.belongsTo(db.user, { allowNull: false, as: 'createdBy' });

db.supplier = require('./supplier.model.js')(seq, Sequelize);
db.supplier.belongsTo(db.user, { allowNull: false, as: 'createdBy' });

// Load products model
db.product = require('./product.model.js')(seq, Sequelize);
db.product.belongsTo(db.user, { allowNull: false, as: 'createdBy' });

// Load settings model
db.category = require('./settings-models/category.model.js')(seq, Sequelize);

db.color = require('./settings-models/color.model.js')(seq, Sequelize);
db.unit = require('./settings-models/unit.model.js')(seq, Sequelize);
db.vat = require('./settings-models/vat.model.js')(seq, Sequelize);
db.status = require('./settings-models/status.model.js')(seq, Sequelize);

// Load document's models
db.document = require('./document.model.js')(seq, Sequelize);
db.documentItem = require('./documentItem.model.js')(seq, Sequelize);

// other loads
db.bank = require('./settings-models/bank.model.js')(seq, Sequelize);

// Define associations
db.permission.belongsToMany(db.user, { through: 'user_permissions' });
db.user.belongsToMany(db.permission, { through: 'user_permissions' });

// Define products's associations
db.product.belongsTo(db.category, { allowNull: false });

db.product.belongsTo(db.unit, { allowNull: false, as: 'unit' });
db.product.belongsTo(db.color, { allowNull: true, as: 'color' });

db.product.belongsTo(db.vat, { allowNull: true, as: 'vat' });

// Define document's associations
db.document.belongsTo(db.client, { allowNull: true, as: 'client' });
db.document.belongsTo(db.supplier, { allowNull: true, as: 'supplier' });
db.document.belongsTo(db.status, { allowNull: true, as: 'status' });

db.documentItem.belongsTo(db.document, { allowNull: false, as: 'document' });
db.documentItem.belongsTo(db.product, { allowNull: true, as: 'product' });

// Define an array of permission types
db.PERMISSIONS = [
  'admin',
  'achat',
  'vente',
  'client',
  'fournisseur',
  'produit',
];

// Export the db object, which contains all the loaded models and Sequelize instance
module.exports = db;
