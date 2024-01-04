const categoryService = require('../services/settings.service');
const colorService = require('../services/settings.service');
const statusService = require('../services/settings.service');
const vatService = require('../services/settings.service');
const unitService = require('../services/settings.service');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);

    return res.status(201).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const updatedCategory = await categoryService.updateCategoryById(
      categoryId,
      req.body
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new color
exports.createColor = async (req, res) => {
  try {
    const color = await colorService.createColor(req.body);

    return res.status(201).json(color);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all colors
exports.getAllColors = async (req, res) => {
  try {
    const colors = await colorService.getAllColors();
    return res.status(200).json(colors);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single color by ID
exports.getColorById = async (req, res) => {
  const { colorId } = req.params;
  try {
    const color = await colorService.getColorById(colorId);
    if (!color) {
      return res.status(404).json({ error: 'Color not found' });
    }
    return res.status(200).json(color);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a color by ID
exports.updateColorById = async (req, res) => {
  const { colorId } = req.params;
  try {
    const updatedColor = await colorService.updateColorById(colorId, req.body);
    if (!updatedColor) {
      return res.status(404).json({ error: 'Color not found' });
    }
    return res.status(200).json(updatedColor);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all statuses
exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await statusService.getAllStatuses();
    return res.status(200).json(statuses);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single status by ID
exports.getStatusById = async (req, res) => {
  const { statusId } = req.params;
  try {
    const status = await statusService.getStatusById(statusId);
    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }
    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all vats
exports.getAllVats = async (req, res) => {
  try {
    const vats = await vatService.getAllVats();
    return res.status(200).json(vats);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single vat by ID
exports.getVatById = async (req, res) => {
  const { vatId } = req.params;
  try {
    const vat = await vatService.getVatById(vatId);
    if (!vat) {
      return res.status(404).json({ error: 'Vat not found' });
    }
    return res.status(200).json(vat);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// Get all units
exports.getAllUnits = async (req, res) => {
  try {
    const units = await unitService.getAllUnits();
    return res.status(200).json(units);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single unit by ID
exports.getUnitById = async (req, res) => {
  const { unitId } = req.params;
  try {
    const unit = await unitService.getUnitById(unitId);
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    return res.status(200).json(unit);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
