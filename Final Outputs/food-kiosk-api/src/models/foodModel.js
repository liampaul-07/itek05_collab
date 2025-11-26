//Connection to database.js
const db = require('../config/database');

// POST/CREATE Query 
const createFood = async (itemData) => {
    const values = [
        itemData.name,
        itemData.category_id,
        itemData.price,
        itemData.stock,
        itemData.is_available
    ];

    const sql = 'INSERT INTO tbl_fooditems (name, category_id, price, stock, is_available) VALUES (?, ?, ?, ?, ?)';
    try {
        const [newFoodId] = await db.query(sql, values);
        return {
            food_id: newFoodId.insertId,
            food_name: itemData.name
        }

    } catch(error) {
        console.error("Error creating new food item:", error);
        throw error;
    }
};

// GET/READ Queries
const getFood = async () => {
    const sql = 'SELECT name, price, food_id, category_id, stock, is_available FROM tbl_fooditems';

    try {
        const [itemResults] = await db.query(sql);
        return itemResults;

    } catch (error) {
        console.error("Error fetching all food items:", error);
        throw error;
    }
};

const getFoodById = async (food_id) => {
    const sql = 'SELECT name, price, food_id, category_id, stock, is_available FROM tbl_fooditems WHERE food_id = ?';

    try {
        //Should only return one(1) item, referenced by ID.
        const [itemResults] = await db.query(sql, [food_id]);
        return itemResults;
    } catch (error) {
        console.error("Error fetching food item by ID:", error);
        throw error;
    }
};
 
const getAvailableFood = async () => {
    const sql = 'SELECT name, price, food_id, category_id, stock FROM tbl_fooditems WHERE is_available = 1 ORDER BY food_id ASC';

    try {
        const [itemResults] = await db.query(sql);
        return itemResults;

    } catch(error) {
        console.error("There is an error in getting available food:", error);
        throw error;
    }
};

const getFoodAvailability = async (food_id) => {
    const sql = 'SELECT is_available FROM tbl_fooditems WHERE food_id = ?';
    try {
        const [result] = await db.query(sql, [food_id]);
        return result.length > 0 ? result[0].is_available : null;
    } catch (error) {
        console.error(`Error fetching availability for ID ${food_id}:`, error);
        throw error;
    }
}

const getFoodByCategory = async (category_id) => {
    const sql = 'SELECT name, price, food_id, stock, is_available FROM tbl_fooditems WHERE category_id = ? ORDER BY category_id ASC';

    try {
        const [itemResults] = await db.query(sql, [category_id]);
        return itemResults;

    } catch (error) {
        console.error("Error in fetching food items by category:", error);
        throw error;
    }
};

// PUT/UPDATE Queries
const updateFood = async (food_id, itemData) => {
    const values = [
        itemData.name,
        itemData.category_id,
        itemData.price,
        itemData.stock,
        itemData.is_available,
        food_id
    ];
    
    const sql = 'UPDATE tbl_fooditems SET name = ?, category_id = ?, price = ?, stock = ?, is_available = ? WHERE food_id = ?';

    try {    
        //Runs the Query, returns true if there are rows affected
        const [itemResults] = await db.query(sql, values);
        return itemResults.affectedRows > 0;

    } catch (error) {
        console.error("Error updating food item:", error);
        throw error;
    }
};

const updateStock = async (food_id, newStock) => {
    const sql = 'UPDATE tbl_fooditems SET stock = ? WHERE food_id = ?';
    
    try {    
        const [itemResults] = await db.query(sql, [newStock, food_id]);
        return itemResults.affectedRows > 0;

    } catch (error) {
        console.error("Error updating food stock:", error);
        throw error;
    }
};
 
const updateAvailability = async (id, is_available) => {
    const sql = 'UPDATE tbl_fooditems SET is_available = ? WHERE food_id = ?';
    
    try {
        const [itemResults] = await db.query(sql, [is_available, id]);
        return itemResults.affectedRows > 0;

    } catch (error) {
        console.error("Error updating food availability:", error);
        throw error;
    }
}

const adjustStock = async (food_id, quantityChange) => {
    const sql = 'UPDATE tbl_fooditems SET stock = stock + ? WHERE food_id = ?'
    const values = [quantityChange, food_id ];
    try {
        const [itemResults] = await db.query(sql, values);
        return itemResults.affectedRows > 0;
    } catch (error) {
        console.error("Error adjusting food stock:", error);
        throw error;
    }
};

// DELETE Query
const destroy = async (req, res) => {
    const categoryId = validateId(req.params.categoryId);

    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid category ID format. Must be a positive integer.'
        });
    }

    try {
        const result = await categoryModel.deleteCategory(categoryId);

        // Expecting result to be the DB result object with affectedRows
        if (result && result.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                message: `Category ID ${categoryId} deleted successfully.`
            });
        }

        // Nothing deleted: category not found
        return res.status(404).json({
            success: false,
            message: `Category ID ${categoryId} not found or already deleted.`
        });

    } catch (error) {
        console.error(`Error deleting category ${categoryId}:`, error);

        // Foreign key constraint (cannot delete because child rows exist)
        if (error.code === 'ER_ROW_IS_REFERENCED' || error.errno === 1451) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete Category ID ${categoryId}: it is referenced by other records.`,
                error_code: 1451
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting category.'
        });
    }
};


const deleteFoodByCategory = async (category_id) => {
    const sql = 'DELETE FROM tbl_fooditems WHERE category_id = ?';

    try {
        //Returns true if there are affected rows.
        const [deleteStatus] = await db.query(sql, [category_id]);
        return deleteStatus;

    } catch (error) {
        console.error("Error deleting food item:", error);
        throw error;
    }
};

module.exports = {
    createFood,
    getFood,
    getFoodById,
    getAvailableFood,
    getFoodByCategory,
    updateFood,
    updateStock,
    updateAvailability,
    getFoodAvailability,
    adjustStock,
    destroy,
    deleteFoodByCategory,
};

