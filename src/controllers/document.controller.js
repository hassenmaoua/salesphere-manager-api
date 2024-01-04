const documentService = require('../services/document.service');
let monthIndex = new Date().getMonth();
let yearIndex = new Date().getFullYear();

// Create a new document
exports.createDocument = async (req, res) => {
  const { document, items } = req.body;
  document.statusId = 1;

  try {
    // Create a new document
    const createdDocument = await documentService.createDocument(document);

    // Set the 'documentId' for each item in the 'items' array
    const itemsWithDocumentId = items.map((item) => ({
      ...item,
      id: undefined,
      documentId: createdDocument.id, // Assign the document's ID
    }));

    console.log(itemsWithDocumentId);

    // Create new items with the 'documentId' values set
    const createdItems = await documentService.bulkCreateItems(
      itemsWithDocumentId
    );

    return res
      .status(201)
      .json({ document: createdDocument, items: createdItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Get documents with pagination, sorting, and searching
exports.getDocuments = async (req, res) => {
  try {
    const {
      page = 1,
      items_per_page = 10,
      sort = 'id',
      order = 'desc',
      search = '',
      code,
      type,
      filter_month,
      filter_year,
      filter_status,
      archived = false,
    } = req.query;

    const documents = await documentService.getDocuments(
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
    );
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single document by ID
exports.getDocumentById = async (req, res) => {
  const { documentId } = req.params;
  try {
    const response = await documentService.getDocumentById(documentId);
    if (!response) {
      return res.status(404).json({ error: 'Document not found' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateDocumentStatus = async (req, res) => {
  const { documentId, code } = req.params;
  try {
    const response = await documentService.updateDocumentStatus(
      documentId,
      code
    );
    if (!response) {
      return res.status(404).json({ error: 'Document or status not found' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getLogisticsInformations = async (req, res) => {
  const { code } = req.query;
  try {
    const response = await documentService.getLogisticsInformations(code);

    if (!response) {
      return res.status(404).json({ error: 'Document or status not found' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSalesDashboardData = async (req, res) => {
  try {
    const response = await documentService.getSalesDashboardData();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSalesTotalsPerMonth = async (req, res) => {
  try {
    const response = await documentService.getSalesTotalsPerMonth();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const response = await documentService.getTopProducts();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
