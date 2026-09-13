const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const { Product, Category } = require("../models");
const uploadsDir = path.join(__dirname, "..", "uploads");

const removeImageFile = (imageUrl) => {
    if (!imageUrl) return;

    const fileName = path.basename(imageUrl);
    const filePath = path.join(uploadsDir, fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const validateProductInput = ({ name, price, stock, categoryId }) => {
    if (!name || !String(name).trim()) {
        return "Product name is required";
    }

    if (price === undefined || price === null || price === "" || Number.isNaN(Number(price)) || Number(price) < 0) {
        return "Valid price is required";
    }

    if (stock === undefined || stock === null || stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
        return "Valid stock value is required";
    }

    if (!categoryId) {
        return "Category is required";
    }

    return null;
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            description,
            price,
            stock,
            categoryId,
            featured,
            returnable,
            productType,
            availability,
            availableDate
        } = req.body;

        const validationError = validateProductInput({ name, price, stock, categoryId });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const product = await Product.create({
            name: String(name).trim(),
            sku: sku ? String(sku).trim() : null,
            description: description ? String(description).trim() : null,
            price: Number(price),
            stock: Number(stock),
            categoryId: Number(categoryId),
            featured: featured === true || featured === "true",
            returnable: returnable === true || returnable === "true",
            productType: productType === "Digital" ? "Digital" : "Physical",
            availability: availability === "Unavailable" ? "Unavailable" : "Available",
            availableDate: availableDate || null,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });

        const createdProduct = await Product.findByPk(product.id, {
            include: [{ model: Category, attributes: ["id", "name"] }]
        });

        return res.status(201).json({
            message: "Product created successfully",
            product: createdProduct
        });
    } catch (error) {
        console.error(error);

        if (req.file) {
            removeImageFile(`/uploads/${req.file.filename}`);
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "SKU already exists" });
        }

        return res.status(500).json({ message: "Failed to create product" });
    }
};

const getProducts = async (req, res) => {
    try {
        const { search, categoryId, page = 1, limit = 10 } = req.query;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { sku: { [Op.like]: `%${search}%` } }
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const currentPage = Math.max(Number(page) || 1, 1);
        const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
        const offset = (currentPage - 1) * currentLimit;

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [{ model: Category, attributes: ["id", "name"] }],
            limit: currentLimit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json({
            products: rows,
            pagination: {
                totalItems: count,
                currentPage,
                totalPages: Math.max(Math.ceil(count / currentLimit), 1),
                limit: currentLimit
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch products" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Category, attributes: ["id", "name"] }]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch product" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            sku,
            description,
            price,
            stock,
            categoryId,
            featured,
            returnable,
            productType,
            availability,
            availableDate
        } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const nextName = name ?? product.name;
        const nextPrice = price ?? product.price;
        const nextStock = stock ?? product.stock;
        const nextCategoryId = categoryId ?? product.categoryId;

        const validationError = validateProductInput({
            name: nextName,
            price: nextPrice,
            stock: nextStock,
            categoryId: nextCategoryId
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        if (Number(nextCategoryId) !== Number(product.categoryId)) {
            const category = await Category.findByPk(nextCategoryId);

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const oldImageUrl = product.imageUrl;

        product.name = String(nextName).trim();
        product.sku = sku !== undefined ? (sku ? String(sku).trim() : null) : product.sku;
        product.description = description !== undefined
            ? (description ? String(description).trim() : null)
            : product.description;
        product.price = Number(nextPrice);
        product.stock = Number(nextStock);
        product.categoryId = Number(nextCategoryId);

        if (featured !== undefined) {
            product.featured = featured === true || featured === "true";
        }

        if (returnable !== undefined) {
            product.returnable = returnable === true || returnable === "true";
        }

        if (productType !== undefined) {
            product.productType = productType === "Digital" ? "Digital" : "Physical";
        }

        if (availability !== undefined) {
            product.availability = availability === "Unavailable" ? "Unavailable" : "Available";
        }

        if (availableDate !== undefined) {
            product.availableDate = availableDate || null;
        }

        if (req.file) {
            product.imageUrl = `/uploads/${req.file.filename}`;
        }

        await product.save();

        if (req.file && oldImageUrl) {
            removeImageFile(oldImageUrl);
        }

        const updatedProduct = await Product.findByPk(product.id, {
            include: [{ model: Category, attributes: ["id", "name"] }]
        });

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);

        if (req.file) {
            removeImageFile(`/uploads/${req.file.filename}`);
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "SKU already exists" });
        }

        return res.status(500).json({ message: "Failed to update product" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const imageUrl = product.imageUrl;
        await product.destroy();
        removeImageFile(imageUrl);

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete product" });
    }
};

const updateProductStock = async (req, res) => {
    try {
        const { stock } = req.body;

        if (
            stock === undefined ||
            stock === null ||
            stock === "" ||
            !Number.isInteger(Number(stock)) ||
            Number(stock) < 0
        ) {
            return res.status(400).json({ message: "Valid stock value is required" });
        }

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.stock = Number(stock);
        await product.save();

        return res.status(200).json({
            message: "Product stock updated successfully",
            product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update product stock" });
    }
};

const updateProductStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (typeof status !== "boolean") {
            return res.status(400).json({ message: "Status must be true or false" });
        }

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.status = status;
        await product.save();

        return res.status(200).json({
            message: "Product status updated successfully",
            product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update product status" });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductStock,
    updateProductStatus
};
