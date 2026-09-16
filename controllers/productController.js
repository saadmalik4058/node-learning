const Product = require("../models/Product");
const { productSchema } = require("../validators/productValidator");

// GET all products
const getProducts = async (req, res) => {
    try {
     const products = await Product.find().populate(
    "createdBy",
    "username email role"
);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get products",
            error: error.message
        });
    }
};

// POST create product
const createProduct = async (req, res) => {
    try {
        const result = productSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues
            });
        }

        const product = new Product({
            ...result.data,
            createdBy: req.user.id
        });

        const savedProduct = await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

// GET single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });
    }
};

// PUT update product
const updateProduct = async (req, res) => {
    try {
        const result = productSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to update this product"
            });
        }

        product.name = result.data.name;
        product.price = result.data.price;

        const updatedProduct = await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};

// DELETE product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (!product.createdBy) {
            return res.status(403).json({
                message: "This product has no owner"
            });
        }

        if (product.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to delete this product"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};