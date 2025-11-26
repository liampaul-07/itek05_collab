const db = require('../config/database'); 

// CREATE Query
const createCustomer = async (customer_name, contact) => {
    const sql = 'INSERT INTO tbl_customers (customer_name, contact) VALUES (?, ?)';
    const values = [customer_name, contact];
    
    try {
        const [result] = await db.query(sql, values);
        
        return { 
            customer_id: result.insertId, 
            customer_name, 
            contact 
        };
    } catch (error) {
        console.error("Error creating customer:", error);
        throw error;
    }
};

// GET Queries
const getCustomers = async () => {
    const sql = 'SELECT customer_name, customer_id, contact, is_active FROM tbl_customers ORDER BY updated_at DESC, customer_id DESC';
    
    try {    
        const [rows] = await db.query(sql); 
        return rows;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

const getCustomersById = async (id) => {
    const sql = 'SELECT customer_id, customer_name, contact, is_active FROM tbl_customers WHERE customer_id = ?';
    
    try {
        const [rows] = await db.query(sql, [id]); 
        return rows[0]; 
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};

// UPDATE Query
const updateCustomer = async (customer_id, customer_name, contact, is_active) => {
    const sql = `UPDATE tbl_customers SET customer_name = ?, contact = ?, is_active = ? WHERE customer_id = ?`;
    const values = [customer_name, contact, is_active, customer_id];

    try {
        const [result] = await db.query(sql, values);
        return result;
    } catch (error) {
        console.error(`Error updating customer ${customer_id}:`, error);
        throw error;
    }
};

const updateIsActive = async (customer_id, is_active) => {
    const sql = `UPDATE tbl_customers SET is_active = ? WHERE customer_id = ?`;
    
    const values = [is_active, customer_id];

    try {
        const [result] = await db.query(sql, values);
        return result;
    } catch (error) {
        console.error(`Error updating customer ${customer_id}:`, error);
        throw error;
    }
};

// --- DELETE ---
const deleteCustomer = async (customer_id) => {
    const sql1 = `DELETE FROM tbl_order_details WHERE order_id IN (SELECT order_id FROM tbl_orders WHERE customer_id = ?)`;
    const sql2 = 'DELETE FROM tbl_orders WHERE customer_id = ?';
    const sql3 = 'DELETE FROM tbl_customers WHERE customer_id = ?';

    try {
        await db.query('START TRANSACTION'); 

        await db.query(sql1, [customer_id]);
        await db.query(sql2, [customer_id]);

        const [resultSql3] = await db.query(sql3, [customer_id]);
        
        await db.query('COMMIT'); 

        return resultSql3;
        
    } catch (error) {
        await db.query('ROLLBACK');
        console.error(`Error deleting customer ${customer_id}:`, error);
        throw error;
    }
};

module.exports = {
    getCustomers,
    getCustomersById,
    createCustomer,
    updateCustomer,
    updateIsActive,
    deleteCustomer,
};