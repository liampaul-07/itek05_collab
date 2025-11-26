const categoryModel = require('../models/categoryModel');
const foodModel = require('../models/foodModel');

const validateId = (id) => {
    const parsedId = parseInt(id);
    return !id || !Number.isInteger(parsedId) || parsedId <= 0 ? false : parsedId;
};

const illegalCharsRegex = /^[a-zA-Z\s-&!]+$/;

// CREATE/STORE Controller
const store = async (req, res) => {
    const { category_name, is_active } = req.body;

    if (category_name === undefined || typeof category_name !== "string" || category_name.trim() === "") {
        return res.status(400).json({
            success: false, 
            message: "Invalid category_name input. Name must be a valid string."
        });
    }
    const trimmedName = category_name.trim();
    
    if (is_active === undefined || typeof is_active !== "number" || (is_active !== 0 && is_active !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_active state. Please input valid is_active state." 
        });   
    }

    if (!illegalCharsRegex.test(category_name)) {
        return res.status(400).json({
            success: false,
            message: "Category name can't contain invalid characters."
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

    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid category ID format. Must be a positive integer.'
        });
    }
    
    if (category_name === undefined || typeof category_name !== "string" || category_name.trim() === "") {
        return res.status(400).json({
            success: false, 
            message: "Invalid name input. Name must be a valid string."
        });
    }

    if (is_active === undefined || typeof is_active !== "number" || (is_active !== 0 && is_active !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_active state. Must be 0 or 1 (number)." 
        });    
    }
   
    if (!illegalCharsRegex.test(category_name)) {
        return res.status(400).json({
            success: false,
            message: "Category name can't contain invalid characters."
        });
    }

    try {
        const isUpdated = await categoryModel.updateCategory(categoryId, category_name, is_active);

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
            message: "Invalid category ID format. Must be a positive integer."
        });
    }

    try {
        // STEP 1: Get food items under this category
        const foodItems = await foodModel.getFoodByCategory(categoryId);

        let categoryDeleteResult;

        // STEP 2: Category has food items → delete them first
        if (foodItems && foodItems.length > 0) {

            const deleteFoodResult = await foodModel.deleteFoodByCategory(categoryId);

            // (Optional) You can check if some items failed to delete
            if (deleteFoodResult.affectedRows === 0) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete associated food items."
                });
            }

            // Now delete the category
            categoryDeleteResult = await categoryModel.deleteCategory(categoryId);

            if (categoryDeleteResult.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully deleted category and its associated food items."
                });
            }

        } 
        
        // STEP 3: No food items → delete category directly
        else {
            categoryDeleteResult = await categoryModel.deleteCategory(categoryId);

            if (categoryDeleteResult.affectedRows > 0) {
                return res.status(204).end(); // No content, category deleted
            }
        }

        // STEP 4: Category not found
        return res.status(404).json({
            success: false,
            message: `Category ID ${categoryId} not found or already deleted.`
        });

    } catch (error) {
        console.error(`Error deleting category ${categoryId}:`, error);

        // Foreign key constraint (still referenced somewhere else)
        if (error.errno === 1451 || error.code === "ER_ROW_IS_REFERENCED") {
            return res.status(409).json({
                success: false,
                message: `Cannot delete Category ID ${categoryId}. It is referenced by existing relationships.`,
                error_code: 1451
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error while deleting category."
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
