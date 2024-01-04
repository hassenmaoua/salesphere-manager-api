const clientService = require('../services/client.service.js');

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);

    return res.status(201).json(client);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get clients with pagination, sorting, and searching
exports.getClients = async (req, res) => {
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
    const clients = await clientService.getClients(
      page,
      items_per_page,
      sort,
      order,
      search,
      filter_type,
      filter_isexempt,
      archived
    );
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const filePath = await clientService.exportToExcel();
    res.download(filePath);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  const { clientId } = req.params;
  try {
    const client = await clientService.getClientById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a client by ID
exports.updateClientById = async (req, res) => {
  const { clientId } = req.params;
  try {
    const updatedClient = await clientService.updateClientById(
      clientId,
      req.body
    );
    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.status(200).json(updatedClient);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Archive a client by ID
exports.archiveClientById = async (req, res) => {
  const { clientId } = req.params;

  const { isArchived } = req.body;
  try {
    const archivedClient = await clientService.archiveClientById(
      clientId,
      isArchived
    );

    if (!archivedClient) {
      return res.status(404).json({ message: 'Client not found' });
    } else return res.status(200).json(archivedClient);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get top 3 Client by Sales
exports.getTopClients = async (req, res) => {
  try {
    const result = await clientService.getTopClients();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
