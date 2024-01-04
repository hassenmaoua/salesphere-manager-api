const db = require('../models'); // Assuming your model is defined in models/index.js
const { Op } = require('sequelize');
const Excel = require('exceljs');
const path = require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const Supplier = db.supplier;

// Create a new supplier
exports.createSupplier = async (supplierData) => {
  try {
    supplierData = { ...supplierData, createdById: 1 };
    const supplier = await Supplier.create(supplierData);
    return supplier;
  } catch (error) {
    throw error;
  }
};

// Get suppliers with pagination, sorting, and searching
exports.getSuppliers = async (
  page,
  items_per_page,
  sort,
  order,
  search,
  filter_type,
  filter_isexempt,
  archived
) => {
  try {
    const options = {
      limit: parseInt(items_per_page),
      offset: (page - 1) * parseInt(items_per_page),
      order: [[sort, order.toUpperCase()]],
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                reference: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                email: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                name: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                phone: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                mobile: {
                  [Op.iLike]: `%${search}%`,
                },
              },
            ],
          },

          filter_type
            ? {
                type: filter_type,
              }
            : null,
          filter_isexempt === 'true'
            ? {
                isExempt: true,
              }
            : null,
        ],
      },
    };

    // If onlyArchived is true, fetch only archived suppliers
    if (archived === 'true') {
      options.where.isArchived = true;
    } else {
      options.where.isArchived = false; // Fetch non-archived suppliers by default
    }

    // Fetch suppliers using the Supplier model
    const suppliers = await Supplier.findAndCountAll(options);

    // Calculate pagination details
    const totalItems = suppliers.count;
    const totalPages = Math.ceil(totalItems / parseInt(items_per_page));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPreviousPage = parseInt(page) > 1;

    // Dynamically generate pagination links
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push({
        url: `/?page=${i}`,
        label: i.toString(),
        active: i === page,
        page: i,
      });
    }

    // Example response structure
    const response = {
      data: suppliers.rows,
      payload: {
        pagination: {
          page: parseInt(page),
          first_page_url: `/?page=1`,
          from: suppliers.count > 0 ? options.offset + 1 : 0,
          last_page: totalPages,
          links: [
            {
              url: hasPreviousPage ? `/?page=${parseInt(page) - 1}` : null,
              label: '&laquo; Previous',
              active: hasPreviousPage,
              page: hasPreviousPage ? parseInt(page) - 1 : null,
            },
            ...paginationLinks, // Include dynamically generated links
            {
              url: hasNextPage ? `/?page=${parseInt(page) + 1}` : null,
              label: 'Next &raquo;',
              active: hasNextPage,
              page: hasNextPage ? parseInt(page) + 1 : null,
            },
          ],
          next_page_url: hasNextPage ? `/?page=${parseInt(page) + 1}` : null,
          items_per_page: items_per_page.toString(),
          prev_page_url: hasPreviousPage
            ? `/?page=${parseInt(page) - 1}`
            : null,
          to: options.offset + suppliers.rows.length,
          total: totalItems,
        },
      },
    };

    return response;
  } catch (error) {
    throw error;
  }
};

// Get all suppliers
exports.getAllSuppliers = async () => {
  try {
    const options = {
      where: {
        isArchived: false,
      },
    };
    const suppliers = await Supplier.findAll(options);
    return suppliers;
  } catch (error) {
    throw error;
  }
};

exports.exportToExcel = async () => {
  try {
    const suppliers = await Supplier.findAll();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('suppliers');

    const headers = [
      'ID',
      'Raison Sociale',
      'Matricule',
      'Telephone',
      'Mobile',
      'Adresse',
      'Chifre daffaire',
    ];
    worksheet.addRow(headers);

    // Set custom column widths
    worksheet.columns = [
      { width: 10 }, // ID
      { width: 30 }, // Raison Sociale
      { width: 20 }, // Matricule
      { width: 15 }, // Telephone
      { width: 15 }, // Mobile
      { width: 30 }, // Adresse
      { width: 15 }, // Chifre daffaire
    ];

    // Add data for each supplier
    suppliers.forEach((supplier) => {
      worksheet.addRow([
        supplier.id,
        supplier.name,
        supplier.taxNumber,
        supplier.phone,
        supplier.mobile,
        supplier.address,
        0,
      ]);
    });

    // Get the current date and time for the file name
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:.TZ]/g, '');

    // Set the file name and path with the current date
    const fileName = 'suppliers.xlsx';
    const filePath = path.join(appDir, 'files', fileName);

    // Write the workbook to a file
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  } catch (error) {
    throw error;
  }
};

// Get a single supplier by ID
exports.getSupplierById = async (supplierId) => {
  try {
    const supplier = await Supplier.findByPk(supplierId);
    return supplier;
  } catch (error) {
    throw error;
  }
};

// Update a supplier by ID
exports.updateSupplierById = async (supplierId, updatedSupplierData) => {
  try {
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return null; // Supplier not found
    }

    await supplier.update(updatedSupplierData);
    return supplier;
  } catch (error) {
    throw error;
  }
};

// Archive a supplier by ID
exports.archiveSupplierById = async (supplierId, isArchived) => {
  try {
    const supplier = await Supplier.findByPk(supplierId);

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    // Update the isArchived field based on the provided value (true for archive, false for unarchive)
    await supplier.update({ isArchived });

    return supplier;
  } catch (error) {
    throw error;
  }
};
