const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createColor,
  updateColor,
  deleteColor,
  createSize,
  updateSize,
  deleteSize,
  getAllOrders,
  updateOrderStatus,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} = require("../models/adminModel");

// =================== PRODUCTS ===================
async function getProductController(req, res) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getProductDetailController(req, res) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createProductController(req, res) {
  try {
    const productData = req.body;
    const productId = await createProduct(productData);

    // Colors + Sizes
    for (const color of productData.colors || []) {
      const colorId = await createColor(productId, color);
      for (const size of color.sizes || []) {
        await createSize(colorId, size);
      }
    }

    res.status(201).json({ message: "Product created successfully", productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateProductController(req, res) {
  try {
    const productId = req.params.id;
    const productData = req.body;
    const affected = await updateProduct(productId, productData);
    if (!affected) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteProductController(req, res) {
  try {
    const affected = await deleteProduct(req.params.id);
    if (!affected) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// =================== COLORS ===================
async function createColorController(req, res) {
  try {
    const { productId } = req.params;
    const colorId = await createColor(productId, req.body);
    res.status(201).json({ colorId, message: "Color created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateColorController(req, res) {
  try {
    const { colorId } = req.params;
    const affected = await updateColor(colorId, req.body);
    if (!affected) return res.status(404).json({ message: "Color not found" });
    res.json({ message: "Color updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteColorController(req, res) {
  try {
    const { colorId } = req.params;
    const affected = await deleteColor(colorId);
    if (!affected) return res.status(404).json({ message: "Color not found" });
    res.json({ message: "Color deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// =================== SIZES ===================
async function createSizeController(req, res) {
  try {
    const { colorId } = req.params;
    const sizeId = await createSize(colorId, req.body);
    res.status(201).json({ sizeId, message: "Size created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateSizeController(req, res) {
  try {
    const { sizeId } = req.params;
    const affected = await updateSize(sizeId, req.body);
    if (!affected) return res.status(404).json({ message: "Size not found" });
    res.json({ message: "Size updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteSizeController(req, res) {
  try {
    const { sizeId } = req.params;
    const affected = await deleteSize(sizeId);
    if (!affected) return res.status(404).json({ message: "Size not found" });
    res.json({ message: "Size deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// =================== ORDERS ===================
async function getOrders(req, res) {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function changeOrderStatus(req, res) {
  try {
    const affected = await updateOrderStatus(req.params.id, req.body.status);
    if (!affected) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// =================== BANNERS ===================
async function getBannerController(req, res) {
  try {
    const banners = await getAllBanners();
    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createBannerController(req, res) {
  try {
    const id = await createBanner(req.body);
    res.status(201).json({ id, message: "Banner added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateBannerController(req, res) {
  try {
    const affected = await updateBanner(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteBannerController(req, res) {
  try {
    const affected = await deleteBanner(req.params.id);
    if (!affected) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getProductController,
  getProductDetailController,
  createProductController,
  updateProductController,
  deleteProductController,
  createColorController,
  updateColorController,
  deleteColorController,
  createSizeController,
  updateSizeController,
  deleteSizeController,
  getOrders,
  changeOrderStatus,
  getBannerController,
  createBannerController,
  updateBannerController,
  deleteBannerController,
};
