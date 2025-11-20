const db = require('../config/database'); 

// --- READ: getCategories (Retrieve all categories) ---
const getCategories = async () => {
    try {
        const sql = 'SELECT category_id, name, description, is_active, created_at FROM tbl_categories ORDER BY name ASC';
        
        const [rows] = await db.query(sql); 
        return rows;
    } catch (error) {
        console.error("Error fetching all categories:", error);
        throw error;
    }
};

// --- NEW READ: getCategoryById (Retrieve a single category by ID) ---
const getCategoryById = async (id) => {
    try {
        // Query to select one specific category
        const sql = 'SELECT category_id, name, description, is_active, created_at FROM tbl_categories WHERE category_id = ?';
        
        const [rows] = await db.query(sql, [id]); 
        
        // Return the first row (the category object) or undefined/null if not found
        return rows[0]; 
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};

// --- NEW READ: getActiveCategories (Retrieve only active categories) ---
const getActiveCategories = async () => {
    try {
        // Query to select categories where is_active is true (1)
        const sql = 'SELECT category_id, name, description FROM tbl_categories WHERE is_active = 1 ORDER BY name ASC';
        
        const [rows] = await db.query(sql); 
        return rows;
    } catch (error) {
        console.error("Error fetching active categories:", error);
        throw error;
    }
};

// --- CREATE: createCategory (Insert a new category) ---
const createCategory = async (name, description, is_active = true) => {
    try {
        const sql = 'INSERT INTO tbl_categories (name, description, is_active) VALUES (?, ?, ?)';
        const params = [name, description, is_active];
        
        const [result] = await db.query(sql, params);
        
        return { 
            category_id: result.insertId, 
            name, 
            description, 
            is_active 
        };
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

// --- UPDATE: updateCategory (Modify an existing category by ID) ---
const updateCategory = async (id, name, description, is_active) => {
    const setClauses = [];
    const values = [];

    if (name !== undefined) {
        setClauses.push('name = ?');
        values.push(name);
    }
    if (description !== undefined) {
        setClauses.push('description = ?');
        values.push(description);
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

// --- DELETE: deleteCategory (Remove a category by ID) ---
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

// Export all model functions (including the new ones)
module.exports = {
    getCategories,
    getCategoryById, // NEW EXPORT
    getActiveCategories, // NEW EXPORT
    createCategory,
    updateCategory,
    deleteCategory,
};