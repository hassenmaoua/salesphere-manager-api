const db = require('../models');
const Category = db.category;
const Color = db.color;
const Status = db.status;
const Vat = db.vat;
const Unit = db.unit;

// Create a new category
exports.createCategory = async (categoryData) => {
  try {
    const category = await Category.create(categoryData);
    return category;
  } catch (error) {
    throw error;
  }
};

// Get all categories
exports.getAllCategories = async () => {
  try {
    const categories = await Category.findAll();
    return categories;
  } catch (error) {
    throw error;
  }
};

// Get a single category by ID
exports.getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findByPk(categoryId);
    return category;
  } catch (error) {
    throw error;
  }
};

// Update a category by ID
exports.updateCategoryById = async (categoryId, updatedCategoryData) => {
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return null;
    }

    await category.update(updatedCategoryData);
    return category;
  } catch (error) {
    throw error;
  }
};

// Create a new color
exports.createColor = async (colorData) => {
  try {
    const color = await Color.create(colorData);
    return color;
  } catch (error) {
    throw error;
  }
};

// Get all colors
exports.getAllColors = async () => {
  try {
    const colors = await Color.findAll();
    return colors;
  } catch (error) {
    throw error;
  }
};

// Get a single color by ID
exports.getColorById = async (colorId) => {
  try {
    const color = await Color.findByPk(colorId);
    return color;
  } catch (error) {
    throw error;
  }
};

// Update a color by ID
exports.updateColorById = async (colorId, updatedColorData) => {
  try {
    const color = await Color.findByPk(colorId);
    if (!color) {
      return null;
    }

    await color.update(updatedColorData);
    return color;
  } catch (error) {
    throw error;
  }
};

// Create a new status
exports.createStatus = async (statusData) => {
  try {
    const status = await Status.create(statusData);
    return status;
  } catch (error) {
    throw error;
  }
};

// Get all statues
exports.getAllStatuses = async () => {
  try {
    const statues = await Status.findAll();
    return statues;
  } catch (error) {
    throw error;
  }
};

// Get a single status by ID
exports.getStatusById = async (statusId) => {
  try {
    const status = await Status.findByPk(statusId);
    return status;
  } catch (error) {
    throw error;
  }
};
// Get a single status by ID
exports.getStatusByCode = async (statusCode) => {
  try {
    const status = await Status.findOne({ where: { code: statusCode } });
    return status;
  } catch (error) {
    throw error;
  }
};

// Update a status by ID
exports.updateStatusById = async (statusId, updatedStatusData) => {
  try {
    const status = await Status.findByPk(statusId);
    if (!status) {
      return null;
    }

    await status.update(updatedStatusData);
    return status;
  } catch (error) {
    throw error;
  }
};

// Create a new vat
exports.createVat = async (vatData) => {
  try {
    const vat = await Vat.create(vatData);
    return vat;
  } catch (error) {
    throw error;
  }
};

// Get all vats
exports.getAllVats = async () => {
  try {
    const vats = await Vat.findAll();
    return vats;
  } catch (error) {
    throw error;
  }
};

// Get a single vat by ID
exports.getVatById = async (vatId) => {
  try {
    const vat = await Vat.findByPk(vatId);
    return vat;
  } catch (error) {
    throw error;
  }
};

// Update a vat by ID
exports.updateVatById = async (vatId, updatedVatData) => {
  try {
    const vat = await Vat.findByPk(vatId);
    if (!vat) {
      return null;
    }

    await vat.update(updatedVatData);
    return vat;
  } catch (error) {
    throw error;
  }
};

// Create a new unit
exports.createUnit = async (unitData) => {
  try {
    const unit = await Unit.create(unitData);
    return unit;
  } catch (error) {
    throw error;
  }
};

// Get all units
exports.getAllUnits = async () => {
  try {
    const units = await Unit.findAll();
    return units;
  } catch (error) {
    throw error;
  }
};

// Get a single unit by ID
exports.getUnitById = async (unitId) => {
  try {
    const unit = await Unit.findByPk(unitId);
    return unit;
  } catch (error) {
    throw error;
  }
};

// Update a unit by ID
exports.updateUnitById = async (unitId, updatedUnitData) => {
  try {
    const unit = await Unit.findByPk(unitId);
    if (!unit) {
      return null;
    }

    await unit.update(updatedUnitData);
    return unit;
  } catch (error) {
    throw error;
  }
};
