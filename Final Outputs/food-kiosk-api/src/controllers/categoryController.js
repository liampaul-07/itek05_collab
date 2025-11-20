// Imports the Category Model which contains all the database logic
const categoryModel = require('../models/categoryModel');

/**
 * Controller layer for handling HTTP requests for tbl_categories.
 */

// --- READ ALL (index): GET /api/categories ---
const index = async (req, res) => {
    try {
        // Calls the model function to get the data from database.
        const categories = await categoryModel.getCategories();
        
        // If successful, sends the data back to the client with a 200 OK status.
        return res.status(200).json({
            message: 'All categories retrieved successfully.',
        });
    } catch (error) {
        // If it returns an error, goes in the catch block
        console.error("Error in index controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving categories.',
            details: error.message,
        });
    }
};