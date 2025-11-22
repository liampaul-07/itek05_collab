//Connection to database.js
const db = require('../config/database');

// POST/CREATE Query 
const createFood = async (itemData) => {
    try {
        const sql = 'INSERT INTO tbl_fooditems (name, category_id, price, stock, is_available) VALUES (?, ?, ?, ?, ?)'
        const values = [
            itemData.name,
            itemData.category_id,
            itemData.price,
            itemData.stock,
            itemData.is_available
        ];
        
        //Creates new Food Item, and returns its ID.
        const [newFoodId] = await db.query(sql, values);
        return newFoodId.insertId;

    } catch(error) {
        console.error("Error creating new food item:", error);
        throw error;
    }
};

// GET/READ Queries
const getFood = async () => {
    try {
        const sql = 'SELECT name, price, food_id, category_id, stock, is_available FROM tbl_fooditems';
        const [itemResults] = await db.query(sql);
        return itemResults;

    } catch (error) {
        console.error("Error fetching all food items:", error);
        throw error;
    }
};

const getFoodById = async (food_id) => {
    try {
        const sql = 'SELECT name, price, food_id, category_id, stock, is_available FROM tbl_fooditems WHERE food_id = ?';
        
        //Should only return one(1) item, referenced by ID.
        const [itemResults] = await db.query(sql, [food_id]);
        return itemResults;

    } catch (error) {
        console.error("Error fetching food item by ID:", error);
        throw error;
    }
};
 
const getAvailableFood = async () => {
    try {
        const sql = 'SELECT name, price, food_id, category_id, stock FROM tbl_fooditems WHERE is_available = 1 ORDER BY food_id ASC';
        const [itemResults] = await db.query(sql);
        return itemResults;

    } catch(error) {
        console.error("There is an error in getting available food:", error);
        throw error;
    }
};

const getFoodByCategory = async (category_id) => {
    try {
        const sql = 'SELECT name, price, food_id, stock, is_available FROM tbl_fooditems WHERE category_id = ? ORDER BY category_id ASC';
        const [itemResults] = await db.query(sql, [category_id]);
        return itemResults;

    } catch (error) {
        console.error("Error in fetching food items by category:", error);
        throw error;
    }
};

// PUT/UPDATE Queries
const updateFood = async (food_id, itemData) => {
    try {
        const sql = 'UPDATE tbl_fooditems SET name = ?, category_id = ?, price = ?, stock = ?, is_available = ? WHERE food_id = ?';

        const values = [
            itemData.name,
            itemData.category_id,
            itemData.price,
            itemData.stock,
            itemData.is_available,
            food_id
        ];

        //Runs the Query, returns true if there are rows affected
        const [itemResults] = await db.query(sql, values);
        return itemResults.affectedRows > 0;

    } catch (error) {
        console.log("Error updating food item:", error);
        throw error;
    }
};

const updateStock = async (food_id, newStock) => {
    try {
        const sql = 'UPDATE tbl_fooditems SET stock = ? WHERE food_id = ?';
        
        const [result] = await db.query(sql, [newStock, food_id]);
        return result.affectedRows > 0;

    } catch (error) {
        console.error("Error updating food stock:", error);
        throw error;
    }
};
 
const updateAvailability = async (id, is_available) => {
    try {
        const sql = 'UPDATE tbl_fooditems SET is_available = ? WHERE food_id = ?';

        const [result] = await db.query(sql, [is_available, id]);
        return result.affectedRows > 0;

    } catch (error) {
        console.error("Error updating food availability:", error);
        throw error;
    }
}

// DELETE Query
const deleteFood = async (food_id) => {
    try {
        const sql = 'DELETE FROM tbl_fooditems WHERE food_id = ?';
        
        //Returns true if there are affected rows.
        const [deleteStatus] = await db.query(sql, [food_id]);
        return deleteStatus.affectedRows > 0;

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
    deleteFood,
};

