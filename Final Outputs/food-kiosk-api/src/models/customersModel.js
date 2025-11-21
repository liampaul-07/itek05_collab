const db = require('../config/database'); 

// --- READ ALL ---
const getCustomers = async () => {
    try {
        const sql = 'SELECT customer_id, customer_name, contact, is_active, created_at FROM tbl_customers ORDER BY customer_name ASC';
        const [rows] = await db.query(sql); 
        return rows;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

// --- READ BY ID ---
const getCustomersById = async (id) => {
    try {
        const sql = 'SELECT customer_id, customer_name, contact, is_active FROM tbl_customers WHERE customer_id = ?';
        const [rows] = await db.query(sql, [id]); 
        return rows[0]; 
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};

// --- CREATE ---
const createCustomer = async (customerName, contact) => {
    // Note: is_active has a default of 1 (true) in the DB
    try {
        const sql = 'INSERT INTO tbl_customers (customer_name, contact) VALUES (?, ?)';
        const params = [customerName, contact];
        
        const [result] = await db.query(sql, params);
        
        return { 
            customer_id: result.insertId, 
            customerName, 
            contact 
            // is_active will be 1 by default
        };
    } catch (error) {
        console.error("Error creating customer:", error);
        throw error;
    }
};

// --- UPDATE ---
const updateCustomer = async (id, customerName, contact, isActive) => {
    const setClauses = [];
    const values = [];

    if (customerName !== undefined) {
        setClauses.push('customer_name = ?');
        values.push(customerName);
    }
    if (contact !== undefined) {
        setClauses.push('contact = ?');
        values.push(contact);
    }
    if (isActive !== undefined) {
        setClauses.push('is_active = ?');
        values.push(isActive);
    }

    if (setClauses.length === 0) {
        return { affected: 0 }; 
    }

    values.push(id); 
    const sql = `UPDATE tbl_customers SET ${setClauses.join(', ')} WHERE customer_id = ?`;

    try {
        const [result] = await db.query(sql, values);
        return { affected: result.affectedRows };
    } catch (error) {
        console.error(`Error updating customer ${id}:`, error);
        throw error;
    }
};

// --- DELETE ---
const deleteCustomer = async (id) => {
    try {
        const sql = 'DELETE FROM tbl_customers WHERE customer_id = ?';
        
        const [result] = await db.query(sql, [id]);
        
        return { affected: result.affectedRows };
    } catch (error) {
        console.error(`Error deleting customer ${id}:`, error);
        throw error;
    }
};

module.exports = {
    getCustomers,
    getCustomersById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};