const db = require('../models'); // Assuming your model is defined in models/index.js
const { Op } = require('sequelize');
const Excel = require('exceljs');
const path = require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const Client = db.client;

// Create a new client
exports.createClient = async (clientData) => {
  try {
    clientData = { ...clientData, createdById: 1 };

    const client = await Client.create(clientData);
    return client;
  } catch (error) {
    throw error;
  }
};

// Get clients with pagination, sorting, and searching
exports.getClients = async (
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

    // If onlyArchived is true, fetch only archived clients
    if (archived === 'true') {
      options.where.isArchived = true;
    } else {
      options.where.isArchived = false; // Fetch non-archived clients by default
    }

    // Fetch clients using the Client model
    const clients = await Client.findAndCountAll(options);

    // Calculate pagination details
    const totalItems = clients.count;
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
      data: clients.rows,
      payload: {
        pagination: {
          page: parseInt(page),
          first_page_url: `/?page=1`,
          from: clients.count > 0 ? options.offset + 1 : 0,
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
          to: options.offset + clients.rows.length,
          total: totalItems,
        },
      },
    };

    return response;
  } catch (error) {
    throw error;
  }
};

// Get all clients
exports.getAllClients = async () => {
  try {
    const options = {
      where: {
        isArchived: false,
      },
    };
    const clients = await Client.findAll(options);
    return clients;
  } catch (error) {
    throw error;
  }
};

exports.exportToExcel = async () => {
  try {
    const clients = await Client.findAll();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('clients');

    const headers = [
      'ID',
      'Raison Sociale',
      'Matricule',
      'Exonération',
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
      { width: 15 }, // Exoneration
      { width: 15 }, // Telephone
      { width: 15 }, // Mobile
      { width: 30 }, // Adresse
      { width: 15 }, // Chifre daffaire
    ];

    // Add data for each client
    clients.forEach((client) => {
      worksheet.addRow([
        client.id,
        client.name,
        client.taxNumber,
        client.exemptNumber,
        client.phone,
        client.mobile,
        client.address,
        0,
      ]);
    });

    // Set the file name and path with the current date
    const fileName = 'clients.xlsx';
    const filePath = path.join(appDir, 'files', fileName);

    // Write the workbook to a file
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  } catch (error) {
    throw error;
  }
};

// Get a single client by ID
exports.getClientById = async (clientId) => {
  try {
    const client = await Client.findByPk(clientId);
    return client;
  } catch (error) {
    throw error;
  }
};

// Update a client by ID
exports.updateClientById = async (clientId, updatedClientData) => {
  try {
    const client = await Client.findByPk(clientId);
    if (!client) {
      return null; // Client not found
    }

    await client.update(updatedClientData);
    return client;
  } catch (error) {
    throw error;
  }
};

// Archive a client by ID
exports.archiveClientById = async (clientId, isArchived) => {
  try {
    const client = await Client.findByPk(clientId);

    if (!client) {
      throw new Error('Client not found');
    }

    // Update the isArchived field based on the provided value (true for archive, false for unarchive)
    await client.update({ isArchived });

    return client;
  } catch (error) {
    throw error;
  }
};

exports.getTopClients = async () => {
  try {
    const topClients = await Client.findAll({
      order: [['revenue', 'DESC']], // Sorting by sales in descending order
      limit: 3, // Limiting the result to the top 3 clients
    });

    const clients = topClients.map((client) => ({
      id: client.id,
      name: client.name,
      revenue: client.revenue,
    }));

    return clients;
  } catch (error) {
    throw error;
  }
};
