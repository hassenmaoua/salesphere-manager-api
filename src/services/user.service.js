const db = require('../models'); // Assuming your model is defined in models/index.js
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const Excel = require('exceljs');
const path = require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const User = db.user;
const Permission = db.permission;

const sequelize = require('../config/database');

// Create a new user
exports.createUser = async (userData) => {
  const { name, email, password, permissions } = userData;

  try {
    var user = await sequelize.transaction(async (t) => {
      // Create a new user
      const newUser = await User.create(
        {
          name,
          email,
          password: bcrypt.hashSync(password, 8),
        },
        { transaction: t }
      );

      // If permissions are provided, associate them with the user
      if (permissions) {
        const permissionInstances = await Permission.findAll({
          where: {
            name: {
              [Op.or]: permissions,
            },
          },
          transaction: t,
        });

        await newUser.setPermissions(permissionInstances, { transaction: t });
      }

      // Fetch the user with associated permissions (only id and name)
      const userWithPermissions = await User.findByPk(newUser.id, {
        include: [
          {
            model: Permission,
            as: 'permissions',
            attributes: ['name'],
            through: { attributes: [] },
          },
        ],
        transaction: t,
      });

      return userWithPermissions;
    });

    return {
      ...user.toJSON(),
      permissions: user.permissions.map((permission) => permission.name),
    };
  } catch (error) {
    throw error;
  }
};

// Get users with pagination, sorting, and searching
exports.getUsers = async (
  page,
  items_per_page,
  sort,
  order,
  search,
  active
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
                position: {
                  [Op.iLike]: `%${search}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['name'],
          through: { attributes: [] }, // Exclude the association table attributes
        },
      ],
    };

    // If onlyArchived is true, fetch only active users
    if (active === 'true') {
      options.where.isActive = true;
    } else {
      options.where.isActive = false; // Fetch non-active users by default
    }

    // Fetch users using the User model
    const users = await User.findAndCountAll(options);

    // Calculate pagination details
    const totalItems = users.count;
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
      data: users.rows.map((user) => ({
        ...user.toJSON(),
        permissions: user.permissions.map((permission) => permission.name),
      })),
      payload: {
        pagination: {
          page: parseInt(page),
          first_page_url: `/?page=1`,
          from: users.count > 0 ? options.offset + 1 : 0,
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
          to: options.offset + users.rows.length,
          total: totalItems,
        },
      },
    };
    // Exclude the 'password' attribute from the user data
    response.data = response.data.map((user) => {
      const { password, ...userDataWithoutPassword } = user;
      return userDataWithoutPassword;
    });

    return response;
  } catch (error) {
    throw error;
  }
};

// Get all users
exports.getAllUsers = async () => {
  try {
    const options = {
      where: {
        isActive: false,
      },
    };
    const users = await User.findAll(options);
    return users;
  } catch (error) {
    throw error;
  }
};

exports.exportToExcel = async () => {
  try {
    const users = await User.findAll();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('users');

    const headers = ['ID', 'Nom', 'Position', 'Date Creation'];
    worksheet.addRow(headers);

    // Set custom column widths
    worksheet.columns = [
      { width: 10 }, // ID
      { width: 30 }, // Nom
      { width: 20 }, // Position
      { width: 15 }, // Date Creation
    ];

    // Add data for each user
    users.forEach((user) => {
      worksheet.addRow([user.id, user.name, user.position, user.createdAt]);
    });

    // Get the current date and time for the file name
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:.TZ]/g, '');

    // Set the file name and path with the current date
    const fileName = 'users.xlsx';
    const filePath = path.join(appDir, 'files', fileName);

    // Write the workbook to a file
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  } catch (error) {
    throw error;
  }
};

// Get a single user by ID
exports.getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

// Update a user by ID
exports.updateUserById = async (userId, updatedUserData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return null; // User not found
    }

    await user.update(updatedUserData);
    return user;
  } catch (error) {
    throw error;
  }
};

// Activate a user by ID
exports.activateUserById = async (userId, isActive) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update the isActive field based on the provided value (true for active, false for unactive)
    await user.update({ isActive });

    return user;
  } catch (error) {
    throw error;
  }
};
