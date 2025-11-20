//Connection to database.js
const db = require('../config/database');

//Get all food items for tbl_fooditems.
const getFood = async () => {
    try {
        const sql = 'SELECT food_id, category_id, name, price, stock, is_available FROM tbl_fooditems';
        
        const [rows] = await db.query(sql);
        return rows;
    //Error in fetching food items.
    } catch (error) {
        console.error("Error fetching all food items:", error);
        throw error;
    }
};

//Create a new food item
const createFood = async (itemData) => {
    try {
        //Query for creating/adding
        const sql = 'INSERT INTO tbl_fooditems (name, category_id, price, stock, is_available) VALUES (?, ?, ?, ?, ?)'
        
        //Array from itemdata object
        const params = [
            itemData.name,
            itemData.category_id,
            itemData.price,
            itemData.stock,
            itemData.is_available
        ];
        
        //Executes the query
        const [result] = await db.query(sql, params);

        //Returns the ID of the newly inserted item
        return result.insertId;
    } catch(error) {
        console.error("Error creating new food item:", error);
        throw error;
    }
};

const updateFood = async (id, itemData) => {
    try {
        //Query
        const sql = 'UPDATE tbl_fooditems SET name = ?, category_id = ?, price = ?, stock = ?, is_available = ? WHERE food_id = ?';

        //Values array
        const params = [
            itemData.name,
            itemData.category_id,
            itemData.price,
            itemData.stock,
            itemData.is_available,
            id
        ];
        
        //Result contains affected rows
        const [result] = await db.query(sql, params);

        //Returns true if there is a row affected
        return result.affectedRows > 0;
    } catch (error) {
        console.log("Error updating food item:", error);
        throw error;
    }
}

const deleteFood = async (id) => {
    try {
        const deleteDetailSql = 'DELETE FROM tbl_orderdetails WHERE food_id = ?';
        await db.query(deleteDetailSql, [id]);
        
        //Query
        const deleteFoodSql = 'DELETE FROM tbl_fooditems WHERE food_id = ?';

        //Receives the result
        const [result] = await db.query(deleteFoodSql, [id]);

        //Returns result if there are affected rows
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting food item:", error);
        throw error;
    }
};

const getFoodById = async (id) => {
    try {
        const sql = 'SELECT food_id, category_id, name, price, stock, is_available FROM tbl_fooditems WHERE food_id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows;
    } catch (error) {
        console.error("Error fetching food item by ID:", error);
        throw error;
    }
};
 
const getAvailableFood = async () => {
    try {
        const sql = 'SELECT food_id, category_id, name, price, stock FROM tbl_fooditems WHERE is_available = 1 ORDER BY name ASC';

        const [rows] = await db.query(sql);
        return rows;
    } catch(error) {
        console.error("There is an error in getting available food:", error);
        throw error;
    }
};

const getFoodByCategory = async (category_id) => {
    try {
        const sql = 'SELECT * FROM tbl_fooditems WHERE category_id = ? ORDER BY category_id ASC';

        const [rows] = await db.query(sql, [category_id]);
        return rows;
    } catch (error) {
        console.error("Error in fetching food items by category:", error);
        throw error;
    }
};

const updateStock = async (id, newStock) => {
    try {
        const sql = 'UPDATE tbl_fooditems SET stock = ? WHERE food_id = ?';
        
        const [result] = await db.query(sql, [newStock, id]);
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

module.exports = {
    getFood,
    createFood,
    updateFood,
    deleteFood,
    getFoodByCategory,
    getFoodById,
    getAvailableFood,
    updateStock,
    updateAvailability,
};