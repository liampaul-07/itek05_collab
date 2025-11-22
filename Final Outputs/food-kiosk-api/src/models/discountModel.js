const db = require('../config/database'); 

// --- READ ALL (getDiscounts) ---
const getDiscounts = async () => {
    try {
        const sql = 'SELECT discount_id, code, percentage, usage_limit, usage_count, is_active, created_at FROM tbl_discounts ORDER BY code ASC';
        const [rows] = await db.query(sql); 
        return rows;
    } catch (error) {
        console.error("Error fetching discounts:", error);
        throw error;
    }
};

// --- READ BY CODE (getDiscountByCode) ---
const getDiscountByCode = async (code) => {
    try {
        const sql = 'SELECT discount_id, code, percentage, usage_limit, usage_count, is_active FROM tbl_discounts WHERE code = ? AND is_active = 1';
        const [rows] = await db.query(sql, [code]); 
        return rows[0]; 
    } catch (error) {
        console.error(`Error fetching discount by code ${code}:`, error);
        throw error;
    }
};

// --- READ USAGE (getDiscountUsage) ---
const getDiscountUsage = async (id) => {
    try {
        const sql = 'SELECT usage_limit, usage_count FROM tbl_discounts WHERE discount_id = ?';
        const [rows] = await db.query(sql, [id]); 
        return rows[0]; 
    } catch (error) {
        console.error(`Error fetching discount usage for ID ${id}:`, error);
        throw error;
    }
};

// --- CREATE (createDiscount) ---
const createDiscount = async (code, percentage, usageLimit, isActive = true) => {
    try {
        const sql = 'INSERT INTO tbl_discounts (code, percentage, usage_limit, is_active) VALUES (?, ?, ?, ?)';
        const params = [code, percentage, usageLimit, isActive];
        
        const [result] = await db.query(sql, params);
        
        return { 
            discount_id: result.insertId, 
            code, 
            percentage
        };
    } catch (error) {
        console.error("Error creating discount:", error);
        throw error;
    }
};

// --- UPDATE (updateDiscount) ---
const updateDiscount = async (id, code, percentage, usageLimit, isActive) => {
    const setClauses = [];
    const values = [];

    if (code !== undefined) {
        setClauses.push('code = ?');
        values.push(code);
    }
    if (percentage !== undefined) {
        setClauses.push('percentage = ?');
        values.push(percentage);
    }
    if (usageLimit !== undefined) {
        setClauses.push('usage_limit = ?');
        values.push(usageLimit);
    }
    if (isActive !== undefined) {
        setClauses.push('is_active = ?');
        values.push(isActive);
    }

    if (setClauses.length === 0) {
        return { affected: 0 }; 
    }

    values.push(id); 
    const sql = `UPDATE tbl_discounts SET ${setClauses.join(', ')} WHERE discount_id = ?`;

    try {
        const [result] = await db.query(sql, values);
        return { affected: result.affectedRows };
    } catch (error) {
        console.error(`Error updating discount ${id}:`, error);
        throw error;
    }
};

// --- DELETE (deleteDiscount) ---
const deleteDiscount = async (id) => {
    try {
        const sql = 'DELETE FROM tbl_discounts WHERE discount_id = ?';
        
        const [result] = await db.query(sql, [id]);
        
        return { affected: result.affectedRows };
    } catch (error) {
        console.error(`Error deleting discount ${id}:`, error);
        throw error;
    }
};

module.exports = {
    getDiscounts,
    getDiscountByCode,
    getDiscountUsage,
    createDiscount,
    updateDiscount,
    deleteDiscount,
};