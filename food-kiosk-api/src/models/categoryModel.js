const db = require('../config/database'); 

const getCategories = async () => {
    try {
        const sql = 'SELECT category_id, category_name FROM tbl_categories ORDER BY category_id ASC';
        
        const [rows] = await db.query(sql); 
        return rows;
    } catch (error) {
        console.error("Error fetching all categories:", error);
        throw error;
    }
};

const getCategoryById = async (id) => {
    try {
        // Query to select one specific category
        const sql = 'SELECT category_id, category_name, is_active, created_at FROM tbl_categories WHERE category_id = ?';
        
        const [rows] = await db.query(sql, [id]); 
        return rows[0]; 
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};

const getActiveCategories = async () => {
    try {
        const sql = 'SELECT category_id, category_name FROM tbl_categories WHERE is_active = 1 ORDER BY category_id ASC';
        
        const [rows] = await db.query(sql); 
        return rows;
    } catch (error) {
        console.error("Error fetching active categories:", error);
        throw error;
    }
};

const createCategory = async (category_name) => {
    try {
        const sql = 'INSERT INTO tbl_categories (category_name) VALUES (?)';
        const params = [category_name];
        
        const [result] = await db.query(sql, params);
        
        return { 
            category_id: result.insertId, 
            category_name 
        };
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

const updateCategory = async (id, category_name, is_active) => {
    const setClauses = [];
    const values = [];

    if (category_name !== undefined) {
        setClauses.push('category_name = ?');
        values.push(category_name);
    }
    if (is_active !== undefined) { 
        setClauses.push('is_active = ?');
        values.push(is_active);
    }

    if (setClauses.length === 0) {
        return { affected: 0 }; 
    }

    values.push(id); 
    const sql = `UPDATE tbl_categories SET ${setClauses.join(', ')} WHERE category_id = ?`;

    try {
        const [result] = await db.query(sql, values);
        return { affected: result.affectedRows };
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
    }
};

const deleteCategory = async (id) => {
    try {
        const sql = 'DELETE FROM tbl_categories WHERE category_id = ?';
        
        const [result] = await db.query(sql, [id]);
        
        return { affected: result.affectedRows };
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
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