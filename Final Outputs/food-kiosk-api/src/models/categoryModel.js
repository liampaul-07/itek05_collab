//Connection to the database
const db = require('../config/database'); 

// CREATE Query
const createCategory = async (category_name, is_active) => {
    const values = [category_name, is_active];
    const sql = 'INSERT INTO tbl_categories (category_name, is_active) VALUES (?, ?)';

    try {
        const [categoryId] = await db.query(sql, values);
        
        return { 
            category_id: categoryId.insertId, 
            category_name: category_name,
            is_active: is_active
        };
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

// GET Queries
const getCategories = async () => {
    const sql = 'SELECT category_id, category_name FROM tbl_categories ORDER BY category_id ASC';
    
    try {
        const [result] = await db.query(sql); 
        return result;
    } catch (error) {
        console.error("Error fetching all categories:", error);
        throw error;
    }
};

const getCategoryById = async (id) => {
    const sql = 'SELECT category_id, category_name, is_active, created_at FROM tbl_categories WHERE category_id = ?';

    try {
        const [result] = await db.query(sql, [id]); 
        return result[0]; 
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};

const getActiveCategories = async () => {
    const sql = 'SELECT category_id, category_name FROM tbl_categories WHERE is_active = 1 ORDER BY category_id ASC';

    try {
        const [result] = await db.query(sql); 
        return result;
    } catch (error) {
        console.error("Error fetching active categories:", error);
        throw error;
    }
};

// UPDATE Queries
const updateCategory = async (category_id, category_name, is_active) => {
    const sql = `UPDATE tbl_categories SET category_name = ?, is_active = ? WHERE category_id = ?`;
    const values = [category_name, is_active, category_id];

    try {
        const [result] = await db.query(sql, values);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error updating category ${category_id}:`, error);
        throw error;
    }
};

// DELETE Queries
const deleteCategory = async (category_id) => {
    const sql = 'DELETE FROM tbl_categories WHERE category_id = ?';
    
    try {    
        const [result] = await db.query(sql, [category_id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error deleting category ${category_id}:`, error);
        throw error;
    }
};

module.exports = {
    getCategories,
    getCategoryById, 
    getActiveCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};