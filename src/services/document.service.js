const db = require('../models');
const { Op } = require('sequelize');
const { calculatePercentageProgress } = require('../utils/helpers');

const sequelize = require('../config/database');

const Document = db.document;
const Client = db.client;
const Supplier = db.supplier;
const DocumentItem = db.documentItem;
const Status = db.status;
const Color = db.color;
const Product = db.product;

// Create a new document
exports.createDocument = async (documentData) => {
  try {
    const result = await Document.create(documentData);

    return result;
  } catch (error) {
    throw error;
  }
};
// Create a new items
exports.bulkCreateItems = async (items) => {
  try {
    const result = await DocumentItem.bulkCreate(items);
    return result;
  } catch (error) {
    throw error;
  }
};

// Update a document by ID
exports.updateDocumentById = async (documentId, updatedDocumentData) => {
  try {
    const document = await Document.findByPk(documentId);
    if (!document) {
      return null;
    }

    await document.update(updatedDocumentData);
    return document;
  } catch (error) {
    throw error;
  }
};

// Get documents with pagination, sorting, and searching
exports.getDocuments = async (
  page,
  items_per_page,
  sort,
  order,
  search,
  code,
  type,
  filter_month,
  filter_year,
  filter_status,
  archived
) => {
  const filterDate = new Date();
  filterDate.setMonth(filter_month);
  filterDate.setFullYear(filter_year);
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
            ],
          },
          {
            [Op.and]: [
              {
                code: {
                  [Op.iLike]: `%${code}%`,
                },
              },
              {
                type: {
                  [Op.iLike]: `%${type}%`,
                },
              },
            ],
          },

          // Add the condition to filter by the custom date column "dateDocument"
        ],
      },
      include: [
        {
          model: Client,
          as: 'client',
        },
        {
          model: Supplier,
          as: 'supplier',
        },
        {
          model: Status,
          as: 'status',
        },
      ],
    };

    // If onlyArchived is true, fetch only archived documents
    if (archived === 'true') {
      options.where.isArchived = true;
    } else {
      options.where.isArchived = false;
    }

    if (filter_status !== undefined) {
      if (filter_status === '3') {
        options.where.isArchived = true;
      } else options.where.statusId = filter_status;
    }

    if (filter_month !== undefined && filter_year !== undefined) {
      options.where.date = {
        [Op.and]: [
          {
            [Op.gte]: new Date(
              filterDate.getFullYear(),
              filterDate.getMonth(),
              1
            ),
            [Op.lt]: new Date(
              filterDate.getFullYear(),
              filterDate.getMonth() + 1,
              1
            ),
          },
        ],
      };
    }
    // Fetch documents using the Document model
    const documents = await Document.findAndCountAll(options);

    // Calculate pagination details
    const totalItems = documents.count;
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
    // const serializedDocuments = documents.rows.map((document) => {
    //   return serializeDocument(document);
    // });

    // Example response structure
    const response = {
      data: documents.rows,
      payload: {
        pagination: {
          page: parseInt(page),
          first_page_url: `/?page=1`,
          from: documents.count > 0 ? options.offset + 1 : 0,
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
          to: options.offset + documents.rows.length,
          total: totalItems,
        },
      },
    };

    return response;
  } catch (error) {
    throw error;
  }
};

exports.getLogisticsInformations = async (code) => {
  const options = {
    where: {
      [Op.and]: [
        {
          code: {
            [Op.iLike]: `%${code}%`,
          },
          isArchived: {
            [Op.is]: false,
          },
        },
      ],
    },

    attributes: [
      [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalSubtotal'],
      [sequelize.fn('SUM', sequelize.col('total')), 'totalTotal'],
    ],
  };

  // Fetch documents using the Document model
  const sumResult = await Document.findOne(options);

  // Access the sum values
  const totalSubtotal = sumResult.getDataValue('totalSubtotal');
  const totalTotal = sumResult.getDataValue('totalTotal');

  return { totalSubtotal, totalTotal };
};

// Get a single document by ID
exports.getDocumentById = async (documentId) => {
  try {
    const options = {
      include: [
        {
          model: Client,
          as: 'client',
        },
        {
          model: Supplier,
          as: 'supplier',
        },
        {
          model: Status,
          as: 'status',
        },
      ],
    };

    const document = await Document.findByPk(documentId, options);

    if (!document) {
      return null; // Return null when the document is not found
    }

    const items = await DocumentItem.findAll({
      where: { documentId },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: Color,
              as: 'color',
            },
          ],
        },
      ],
    });

    return { document, items };
  } catch (error) {
    throw error;
  }
};
// Get a single document by ID
exports.getDocumentHeaderById = async (documentId) => {
  try {
    const options = {
      include: [
        {
          model: Client,
          as: 'client',
        },
        {
          model: Supplier,
          as: 'supplier',
        },
        {
          model: Status,
          as: 'status',
        },
      ],
    };

    const document = await Document.findByPk(documentId, options);

    if (!document) {
      return null; // Return null when the document is not found
    }

    return document;
  } catch (error) {
    throw error;
  }
};

exports.updateDocumentStatus = async (documentId, code) => {
  try {
    const status = await Status.findOne({ where: { code: code } });
    if (!status) {
      console.log('Status not found');
      return null;
    }

    const document = await Document.findByPk(documentId);
    if (!document) {
      return null; // Return null when the document is not found
    }

    if (document.statusId == status.id) {
      return null;
    }

    let isArchived = undefined;
    if (code === 'CAN_DOC') {
      isArchived = true;
    }

    if (code === 'VAL_DOC' && document.code === 'FV') {
      // Retrieve the items that belong to this document
      const items = await DocumentItem.findAll({
        where: { documentId: document.id },
      });

      // For each item, find the associated product and update its quantity
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          // Update product quantity by reducing item.quantity
          product.quantity -= item.quantity;
          await product.save();
        }
      }

      const client = await Client.findByPk(document.clientId);
      client.revenue += document.total;
      await client.save();
    }

    if (code === 'VAL_DOC' && document.code === 'FA') {
      // Retrieve the items that belong to this document
      const items = await DocumentItem.findAll({
        where: { documentId: document.id },
      });

      // For each item, find the associated product and update its quantity
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          // Update product quantity by reducing item.quantity
          product.quantity += item.quantity;
          await product.save();
        }
      }
      const supplier = await Supplier.findByPk(document.supplierId);
      supplier.revenue += document.total;
      await supplier.save();
    }

    const updatedDocument = await document.update({
      statusId: status.id,
      isArchived,
    });

    return updatedDocument;
  } catch (err) {
    throw err;
  }
};

exports.getSalesDashboardData = async () => {
  try {
    const currentDate = new Date();

    // Calculate the start and end date for the current week
    const first = currentDate.getDate() - currentDate.getDay();
    const startOfWeek = new Date(currentDate.setDate(first));
    startOfWeek.setHours(0, 0, 0);

    const last = first + 6;
    const endOfWeek = new Date(currentDate.setDate(last));
    // Adjust endOfWeek to be the end of the day (23:59:59.999)
    endOfWeek.setHours(23, 59, 59);

    // Calculate the start and end date for the current month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    endOfMonth.setHours(23, 59, 59, 999);

    // Calculate the start and end date for the current year
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    // Fetch total sales for the current week
    var salesWeek = await Document.sum('total', {
      where: {
        code: 'FV',
        isArchived: {
          [Op.is]: false,
        },
        date: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
    });

    if (salesWeek) {
      salesWeek = Number(salesWeek.toFixed(3));
    }

    // Fetch total sales for the current month
    var salesMonth = await Document.sum('total', {
      where: {
        code: 'FV',
        isArchived: {
          [Op.is]: false,
        },
        date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    if (salesMonth) {
      salesMonth = Number(salesMonth.toFixed(3));
    }

    // Fetch total sales for the current year
    var salesYear = await Document.sum('total', {
      where: {
        code: 'FV',
        isArchived: {
          [Op.is]: false,
        },
        date: {
          [Op.between]: [startOfYear, endOfYear],
        },
      },
    });

    if (salesYear) {
      salesYear = Number(salesYear.toFixed(3));
    }

    // Fetch total sales for the previous week
    const salesLastWeek = await Document.sum('total', {
      where: {
        code: 'FV',
        isArchived: {
          [Op.is]: false,
        },
        date: {
          [Op.between]: [
            new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            startOfWeek,
          ],
        },
      },
    });

    const startOfPreviousMonth = new Date(startOfMonth);
    startOfPreviousMonth.setMonth(startOfMonth.getMonth() - 1);
    startOfPreviousMonth.setDate(1);
    startOfPreviousMonth.setHours(0, 0, 0, 0);

    const endOfPreviousMonth = new Date(startOfMonth);
    endOfPreviousMonth.setDate(0); // Sets the day to 0, which represents the last day of the previous month
    endOfPreviousMonth.setHours(23, 59, 59, 999);

    // Fetch total sales for the previous month
    const salesLastMonth = await Document.sum('total', {
      where: {
        code: 'FV',
        isArchived: {
          [Op.is]: false,
        },
        date: {
          [Op.between]: [startOfPreviousMonth, endOfPreviousMonth],
        },
      },
    });

    // Fetch total sales for the previous year
    const salesLastYear = await Document.sum('total', {
      where: {
        code: 'FV',
        date: {
          [Op.between]: [
            new Date(startOfYear.getTime() - 365 * 24 * 60 * 60 * 1000),
            startOfYear,
          ],
        },
      },
    });

    // Calculate percentage progress
    const progressWeek = calculatePercentageProgress(salesWeek, salesLastWeek);
    const progressMonth = calculatePercentageProgress(
      salesMonth,
      salesLastMonth
    );
    const progressYear = calculatePercentageProgress(salesYear, salesLastYear);

    return {
      salesWeek,
      progressWeek,
      salesMonth,
      progressMonth,
      salesYear,
      progressYear,
    };
  } catch (error) {
    throw error;
  }
};

exports.getSalesTotalsPerMonth = async () => {
  try {
    const currentDate = new Date();
    const months = [];
    const totalSales = [];
    const totalPurchases = [];

    // Iterate over the past 6 months
    for (let i = 0; i < 6; i++) {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0
      );
      endOfMonth.setHours(23, 59, 59, 999);

      // Get the short form of the month name in French
      const monthLabel = startOfMonth.toLocaleDateString('fr-FR', {
        month: 'short',
      });

      months.unshift(monthLabel);

      // Fetch total sales for the current month
      const salesMonth = await Document.sum('total', {
        where: {
          code: 'FV',
          isArchived: {
            [Op.is]: false,
          },
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      if (salesMonth != null) {
        totalSales.unshift(Number(salesMonth.toFixed(3)));
      } else {
        totalSales.unshift(0);
      }

      // Fetch total purchases for the current month
      const purchasesMonth = await Document.sum('total', {
        where: {
          code: 'FA',
          isArchived: {
            [Op.is]: false,
          },
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      if (purchasesMonth != null) {
        totalPurchases.unshift(Number(purchasesMonth.toFixed(3)));
      } else {
        totalPurchases.unshift(0);
      }
    }

    return {
      months,
      totalSales,
      totalPurchases,
    };
  } catch (error) {
    throw error;
  }
};

exports.getTopProducts = async () => {
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const documents = await Document.findAll({
    where: {
      code: 'FV',
      isArchived: {
        [Op.is]: false,
      },
      date: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });

  const topProductsMap = new Map(); // Using a Map to keep track of existing products

  for (const document of documents) {
    const items = await DocumentItem.findAll({
      where: { documentId: document.id },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    for (const item of items) {
      const existingProduct = topProductsMap.get(item.product.id);

      if (existingProduct) {
        // If the product already exists in topProducts, update the quantity
        existingProduct.quantity += item.quantity;
      } else {
        // If the product is not in topProducts, add it
        topProductsMap.set(item.product.id, {
          product: {
            id: item.product.id,
            title: item.product.title,
            code: item.product.code,
          },
          quantity: item.quantity,
        });
      }
    }
  }

  // Convert the Map values to an array
  const topProducts = Array.from(topProductsMap.values());

  // Sort the array in descending order by quantity
  topProducts.sort((a, b) => b.quantity - a.quantity);

  // Return only the first 6 products
  const top6Products = topProducts.slice(0, 6);

  return { data: top6Products };
};
