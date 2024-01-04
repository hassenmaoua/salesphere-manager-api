const db = require('../models'); // Assuming your model is defined in models/index.js
const { Op } = require('sequelize');
const Excel = require('exceljs');
const path = require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const documentService = require('./document.service');

const DocumentItem = db.documentItem;

const Product = db.product;
const Category = db.category;
const Color = db.color;
const Vat = db.vat;
const Unit = db.unit;

// Create a new product
exports.createProduct = async (productData) => {
  try {
    const product = await Product.create({ ...productData, createdById: 1 });
    return product;
  } catch (error) {
    throw error;
  }
};

// Get products with pagination, sorting, and searching
exports.getProducts = async (
  page,
  items_per_page,
  sort,
  order,
  search,
  filter_category,
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
                label: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                code: {
                  [Op.iLike]: `%${search}%`,
                },
              },
            ],
          },

          filter_category
            ? {
                categoryId: filter_category,
              }
            : null,
        ],
      },
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Color,
          as: 'color',
        },
        {
          model: Unit,
          as: 'unit',
        },
        {
          model: Vat,
          as: 'vat',
        },
      ],
    };

    // If onlyArchived is true, fetch only archived products
    if (archived === 'true') {
      options.where.isArchived = true;
    } else {
      options.where.isArchived = false; // Fetch non-archived products by default
    }

    // Fetch products using the Product model
    const products = await Product.findAndCountAll(options);

    // Calculate pagination details
    const totalItems = products.count;
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
    // Customize the serialization of associated objects
    const serializedProducts = products.rows.map((product) => {
      return serializeProduct(product);
    });

    // Example response structure
    const response = {
      data: serializedProducts,
      payload: {
        pagination: {
          page: parseInt(page),
          first_page_url: `/?page=1`,
          from: products.count > 0 ? options.offset + 1 : 0,
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
          to: options.offset + products.rows.length,
          total: totalItems,
        },
      },
    };

    return response;
  } catch (error) {
    throw error;
  }
};

// Get all products
exports.getAllProducts = async () => {
  try {
    const options = {
      where: {
        isArchived: false,
      },
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Color,
          as: 'color',
        },
        {
          model: Unit,
          as: 'unit',
        },
        {
          model: Vat,
          as: 'vat',
        },
      ],
    };

    const products = await Product.findAll(options);

    // Customize the serialization of associated objects
    const serializedProducts = products.map((product) => {
      return serializeProduct(product);
    });

    return serializedProducts;
  } catch (error) {
    throw error;
  }
};

exports.exportToExcel = async () => {
  try {
    const options = {
      order: [['categoryId', 'ASC']],
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Color,
          as: 'color',
        },
        {
          model: Unit,
          as: 'unit',
        },
        {
          model: Vat,
          as: 'vat',
        },
      ],
    };

    const products = await Product.findAll(options);

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    const headers = [
      'Identifiant',
      'Categorie',
      'Code',
      'Label',
      'Couleur',
      'Prix',
      'Quantite',
      'Unite',
    ];
    worksheet.addRow(headers);

    // Set custom column widths
    worksheet.columns = [
      { width: 5 }, // ID
      { width: 15 }, // Categorie
      { width: 10 }, // Code
      { width: 30 }, // Label
      { width: 15 }, // Couleur
      { width: 8 }, // Prix
      { width: 8 }, // Quantite
      { width: 10 }, // Unite
    ];

    // Add data for each product
    products.forEach((product) => {
      worksheet.addRow([
        product.id,
        product.category.name,
        product.code,
        product.label,
        product.color?.label,
        product.price,
        product.quantity,
        product.unit.label,
      ]);
    });

    // Set the file name and path
    const fileName = 'products.xlsx';
    const filePath = path.join(appDir, 'files', fileName);

    // Write the workbook to a file
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  } catch (error) {
    throw error;
  }
};

// Get a single product by ID
exports.getProductById = async (productId) => {
  try {
    const options = {
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Color,
          as: 'color',
        },
        {
          model: Unit,
          as: 'unit',
        },
        {
          model: Vat,
          as: 'vat',
        },
      ],
    };
    const product = await Product.findByPk(productId, options);
    return serializeProduct(product);
  } catch (error) {
    throw error;
  }
};

// Update a product by ID
exports.updateProductById = async (productId, updatedProductData) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return null; // Product not found
    }

    await product.update(updatedProductData);
    return product;
  } catch (error) {
    throw error;
  }
};

// Archive a product by ID
exports.archiveProductById = async (productId, isArchived) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Update the isArchived field based on the provided value (true for archive, false for unarchive)
    await product.update({ isArchived });

    return product;
  } catch (error) {
    throw error;
  }
};

exports.getStockMovement = async (
  productId,
  page,
  items_per_page,
  sort,
  order
) => {
  try {
    const options = {
      limit: parseInt(items_per_page),
      offset: (page - 1) * parseInt(items_per_page),
      order: [[sort, order.toUpperCase()]],
      where: { productId },
    };
    // Fetch all items related to the product
    const documentItems = await DocumentItem.findAndCountAll(options);

    const logisticsInfo = [];

    // Iterate through each document item
    for (const item of documentItems.rows) {
      // Fetch the document associated with the current item
      const document = await documentService.getDocumentHeaderById(
        item.documentId
      );

      if (document) {
        // Create an object containing document details and quantity
        const logisticsItem = {
          document,
          item,
        };

        logisticsInfo.push(logisticsItem);
      }
    }

    // Calculate pagination details
    const totalItems = documentItems.count;
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

    return {
      data: logisticsInfo,
      payload: {
        pagination: {
          page: parseInt(page),
          first_page_url: `/?page=1`,
          from: documentItems.count > 0 ? options.offset + 1 : 0,
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
          to: options.offset + documentItems.rows.length,
          total: totalItems,
        },
      },
    };
  } catch (error) {
    // Handle the error here
    console.error('Error in getStockMovement:', error);
    throw error;
  }
};

function serializeProduct(product) {
  return {
    id: product.id,
    code: product.code,
    label: product.label,
    description: product.description,
    quantity: product.quantity,
    price: product.price,
    category: {
      id: product.category.id,
      name: product.category.name,
      isSaleRestricted: product.category.isSaleRestricted,
      isPurchaseRestricted: product.category.isPurchaseRestricted,
    },
    color: product.color
      ? {
          id: product.color.id,
          label: product.color.label,
          hexCode: product.color.hexCode,
        }
      : undefined,
    unit: {
      id: product.unit?.id,
      label: product.unit?.label,
    },
    vat: product.vat
      ? {
          id: product.vat.id,
          value: product.vat.value,
          sign: product.vat.sign,
        }
      : undefined,
    minStock: product.minStock,
    maxStock: product.maxStock,
    isArchived: product.isArchived,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
