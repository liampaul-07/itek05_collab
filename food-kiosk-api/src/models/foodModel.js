//Connection to database.js
const db = require('../config/database');

//Get all food items for tbl_fooditems.
const getAll = async () => {
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

const create = async (itemData) => {
    try {
        const sql = 'INSERT INTO tbl_fooditems (name, category_id, price, stock, is_available) VALUES (?, ?, ?, ?, ?)'
        
        const params = [
            itemData.name,
            itemData.category_id,
            itemData.price,
            itemData.stock,
            itemData.is_available
        ];

        const [result] = await db.query(sql, params);
        return result.insertId;
    } catch(error) {
        console.error("Error creating new food item:", error);
        throw error;
    }
};

module.exports = {
    getAll,
    create,
};