const userService = require('../services/user.service.js');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    console.log(user);

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get users with pagination, sorting, and searching
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      items_per_page = 10,
      sort = 'updatedAt',
      order = 'desc',
      search = '',
      active = 'true',
    } = req.query;
    const users = await userService.getUsers(
      page,
      items_per_page,
      sort,
      order,
      search,
      active
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const filePath = await userService.exportToExcel();
    res.download(filePath);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a user by ID
exports.updateUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await userService.updateUserById(userId, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Activate a user by ID
exports.activateUserById = async (req, res) => {
  const { userId } = req.params;

  const { isActive } = req.body;
  try {
    const activeUser = await userService.activateUserById(userId, isActive);

    if (!activeUser) {
      return res.status(404).json({ error: 'User not found' });
    } else return res.status(200).json(activeUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
