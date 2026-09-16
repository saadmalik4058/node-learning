const express = require("express");

const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

const auth = require("../middleware/auth");

// GET all products
router.get("/products", auth, getProducts);

// POST create product
router.post("/products", auth, createProduct);

// GET single product
router.get("/products/:id", auth, getProductById);

// PUT update product
router.put("/products/:id", auth, updateProduct);

// DELETE product
router.delete("/products/:id", auth, deleteProduct);

module.exports = router;