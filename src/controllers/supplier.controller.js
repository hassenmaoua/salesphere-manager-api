const supplierService = require('../services/supplier.service.js');

// Create a new supplier
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);

    return res.status(201).json(supplier);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get suppliers with pagination, sorting, and searching
exports.getSuppliers = async (req, res) => {
  try {
    const {
      page = 1,
      items_per_page = 10,
      sort = 'updatedAt',
      order = 'desc',
      search = '',
      filter_type,
      filter_isexempt,
      archived = false,
    } = req.query;
    const suppliers = await supplierService.getSuppliers(
      page,
      items_per_page,
      sort,
      order,
      search,
      filter_type,
      filter_isexempt,
      archived
    );
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    return res.status(200).json(suppliers);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const filePath = await supplierService.exportToExcel();
    res.download(filePath);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single supplier by ID
exports.getSupplierById = async (req, res) => {
  const { supplierId } = req.params;
  try {
    const supplier = await supplierService.getSupplierById(supplierId);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    return res.status(200).json(supplier);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a supplier by ID
exports.updateSupplierById = async (req, res) => {
  const { supplierId } = req.params;
  try {
    const updatedSupplier = await supplierService.updateSupplierById(
      supplierId,
      req.body
    );
    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    return res.status(200).json(updatedSupplier);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Archive a supplier by ID
exports.archiveSupplierById = async (req, res) => {
  const { supplierId } = req.params;

  const { isArchived } = req.body;
  try {
    const archivedSupplier = await supplierService.archiveSupplierById(
      supplierId,
      isArchived
    );

    if (!archivedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    } else return res.status(200).json(archivedSupplier);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
