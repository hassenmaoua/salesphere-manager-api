const productService = require('../services/product.service.js');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Get products with pagination, sorting, and searching
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      items_per_page = 10,
      sort = 'updatedAt',
      order = 'desc',
      search = '',
      filter_category,
      archived = false,
    } = req.query;
    const products = await productService.getProducts(
      page,
      items_per_page,
      sort,
      order,
      search,
      filter_category,
      archived
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const filePath = await productService.exportToExcel();
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const updatedProduct = await productService.updateProductById(
      productId,
      req.body
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Archive a product by ID
exports.archiveProductById = async (req, res) => {
  const { productId } = req.params;

  const { isArchived } = req.body;
  try {
    const archivedProduct = await productService.archiveProductById(
      productId,
      isArchived
    );

    if (!archivedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    } else return res.status(200).json(archivedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getStockMovement = async (req, res) => {
  const { productId } = req.params;
  const {
    page = 1,
    items_per_page = 10,
    sort = 'id',
    order = 'desc',
  } = req.query;
  try {
    const data = await productService.getStockMovement(
      productId,
      page,
      items_per_page,
      sort,
      order
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
