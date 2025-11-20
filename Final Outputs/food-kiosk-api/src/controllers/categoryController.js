// Imports the Category Model which contains all the database logic
const categoryModel = require('../models/categoryModel');

// --- READ ALL (index): GET /api/categories ---
const index = async (req, res) => {
    try {
        const categories = await categoryModel.getCategories();
        
        return res.status(200).json({
            success: true,
            message: 'All categories retrieved successfully.',
            data: categories,
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving categories.',
            details: error.message,
        });
    }
};

// --- READ BY ID (show): GET /api/categories/:id ---
const show = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await categoryModel.getCategoryById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Category with ID ${categoryId} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Category ${categoryId} retrieved successfully.`,
            data: category,
        });
    } catch (error) {
        console.error(`Error in show controller for ID ${categoryId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching category by ID.',
            details: error.message,
        });
    }
};

// --- READ ACTIVE (indexActive): GET /api/categories/active ---
const indexActive = async (req, res) => {
    try {
        const activeCategories = await categoryModel.getActiveCategories();
        
        return res.status(200).json({
            success: true,
            message: 'Active categories retrieved successfully.',
            data: activeCategories,
        });
    } catch (error) {
        console.error("Error in indexActive controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving active categories.',
            details: error.message,
        });
    }
};


// --- CREATE (store): POST /api/categories ---
const store = async (req, res) => {
    const { name, description, is_active } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Category name is required.',
        });
    }

    try {
        const newCategory = await categoryModel.createCategory(name, description, is_active);
        
        return res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            data: newCategory,
        });
    } catch (error) {
        console.error("Error in store controller:", error);
        if (error.message.includes('Duplicate entry') || error.message.includes('ER_DUP_ENTRY')) {
             return res.status(409).json({
                success: false,
                message: 'Category with this name already exists.',
                details: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while creating category.',
            details: error.message,
        });
    }
};

// --- UPDATE (update): PUT /api/categories/:id ---
const update = async (req, res) => {
    const categoryId = req.params.id;
    const { name, description, is_active } = req.body;

    if (!name && !description && is_active === undefined) {
        return res.status(400).json({
            success: false,
            message: 'At least one field (name, description, or is_active) must be provided for update.',
        });
    }

    try {
        const result = await categoryModel.updateCategory(categoryId, name, description, is_active);

        if (result.affected === 0) {
            return res.status(404).json({
                success: false,
                message: `Category with ID ${categoryId} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Category with ID ${categoryId} updated successfully.`,
        });
    } catch (error) {
        console.error(`Error in update controller for ID ${categoryId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while updating category.',
            details: error.message,
        });
    }
};

// --- DELETE (destroy): DELETE /api/categories/remove/:id ---
const destroy = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const result = await categoryModel.deleteCategory(categoryId);

        if (result.affected === 0) {
            return res.status(404).json({
                success: false,
                message: `Category with ID ${categoryId} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Category with ID ${categoryId} deleted successfully.`,
        });
    } catch (error) {
        console.error(`Error in destroy controller for ID ${categoryId}:`, error);
        if (error.message.includes('Foreign key constraint failed')) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete category ID ${categoryId} as it is linked to existing food items.`,
                details: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting category.',
            details: error.message,
        });
    }
};

// --- Collective Export ---
// This makes all the functions above public and accessible to categoryRoutes.js
module.exports = {
    index,
    show,
    indexActive,
    store,
    update,
    destroy,
};
