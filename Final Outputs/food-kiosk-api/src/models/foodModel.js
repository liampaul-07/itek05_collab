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

module.exports = {
    getFood,
    createFood,
    updateFood,
    deleteFood,
};