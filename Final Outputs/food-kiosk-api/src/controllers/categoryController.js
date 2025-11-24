const categoryModel = require('../models/categoryModel');

const validateId = (id) => {
    const parsedId = parseInt(id);
    return !id || !Number.isInteger(parsedId) || parsedId <= 0 ? false : parsedId;
};

// CREATE/STORE Controller
const store = async (req, res) => {
    const { category_name, is_active } = req.body;

    const illegalCharsRegex = /^[a-zA-Z0-9\s-&!]+$/;

    const trimmedName = category_name ? category_name.trim() : '';
    if (trimmedName.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Category name contains disallowed characters. Only letters, numbers, spaces, hyphens (-), ampersands (&), and exclamation points (!) are permitted.'
        });
    }
   
    if (is_active === undefined || typeof is_active !== "number" || (is_active !== 0 && is_active !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_active state. Please input valid is_active state." 
        });   
    }

    if (!illegalCharsRegex.test(trimmedName)) {
        return res.status(400).json({
            success: false,
            message: "Category name must be a text string."
        });
    }    

    try {
        const newCategory = await categoryModel.createCategory(trimmedName, is_active);

        return res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            data: newCategory,
        });
         
    } catch (error) {
        console.error("Error in store controller:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while creating category. (Check for duplicate name)'
        });
    }
};

// INDEX/GET Controllers
const index = async (req, res) => {
    try {
        const categories = await categoryModel.getCategories();
        
        if (categories.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No categories found in the database.',
                data: categories,
            });
        }
        return res.status(200).json({
            success: true,
            message: 'All categories retrieved successfully.',
            data: categories,
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving categories.'
        });
    }
};

const show = async (req, res) => {
    const categoryId = validateId(req.params.categoryId);

    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid category ID format. Must be a positive integer.'
        });
    }

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
            message: `Category ID ${categoryId} retrieved successfully.`,
            data: category,
        });
    } catch (error) {
        console.error(`Error in show controller for ID ${categoryId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching category by ID.'
        });
    }
};

const indexActive = async (req, res) => {
    try {
        const activeCategories = await categoryModel.getActiveCategories();
        
        if (activeCategories.length > 0) {
            return res.status(200).json({
                success: true,
                message: `Successfully retrieved ${activeCategories.length} active categories.`,
                data: activeCategories
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Successfully retrieved available food items (0 items).",
                data: activeCategories
            });
        }
    } catch (error) {
        console.error("Error in indexActive controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving active categories.'
        });
    }
};

const update = async (req, res) => {
    const categoryId = validateId(req.params.categoryId);
    const { category_name, is_active } = req.body;
    const illegalCharsRegex = /^[a-zA-Z0-9\s-&!]+$/;

    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid category ID format. Must be a positive integer.'
        });
    }
    
    const trimmedName = category_name ? category_name.trim() : '';
    if (trimmedName.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Category name is required and cannot be empty'
        });
    }

    if (is_active === undefined || typeof is_active !== "number" || (is_active !== 0 && is_active !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_active state. Must be 0 or 1 (number)." 
        });    
    }
   
    if (!illegalCharsRegex.test(trimmedName)) {
        return res.status(400).json({
            success: false,
            message: "Category name must be a text string."
        });
    }

    try {
        const isUpdated = await categoryModel.updateCategory(categoryId, trimmedName, is_active);

        if (!isUpdated) {
            return res.status(404).json({
                success: false,
                message: `Category with ID ${categoryId} not found or no changes were made.`,
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
            message: 'Internal Server Error while updating category.'
        });
    }
};

const destroy = async (req, res) => {
    const categoryId = validateId(req.params.categoryId);

    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid category ID format. Must be a positive integer.'
        })
    }

    try {
        const isDeleted = await categoryModel.deleteCategory(categoryId);

        if (isDeleted) {
            return res.status(204).end();
        } else {
            return res.status(404).json({
                success: false,
                message: `Category ID ${categoryId} not found.`
            });
        }
    } catch (error) {
        console.error(`Error in destroy controller for ID ${categoryId}:`, error);
        if (error.code === 'ER_ROW_IS_REFERENCED' || error.errno === 1451) {
            return res.status(409).json({ 
                success: false,
                message: `Cannot delete Category ID ${categoryId}. It is currently referenced by existing food items.`,
                error_code: 1451
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting category.'
        });
    }
};

module.exports = {
    index,
    show,
    indexActive,
    store,
    update,
    destroy,
};
