const Category = require("../models/Category");

const createCategory = async (req, res) => {
    const { name } = req.body;
        if (!name) {
           return res.status(400).json({
           message: "Category name is required"
    });
}
try {
    const category = await Category.create({
        name
    });

    return res.status(201).json({
        message: "Category created successfully",
        category
    });
} catch (error) {
       console.error(error);

       return res.status(500).json({
           message: "Failed to create category"
});
}
};
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();

        return res.status(200).json({
            categories
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch categories"
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            category
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch category"
        });
    }
};
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        category.name = name;
        await category.save();

        return res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to update category"
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await category.destroy();

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to delete category"
        });
    }
};
const updateCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (typeof status !== "boolean") {
            return res.status(400).json({
                message: "Status must be true or false"
            });
        }

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        category.status = status;
        await category.save();

        return res.status(200).json({
            message: "Category status updated successfully",
            category
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to update category status"
        });
    }
};
module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    updateCategoryStatus
};