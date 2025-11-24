const db = require('../config/database');

// CREATE Query
const createOrder = async (customer_id, ticket_name) => {
    const sql = 'INSERT INTO tbl_orders (customer_id, ticket_name) VALUES (?, ?)';
    const values = [customer_id, ticket_name];

    try {
        const [result] = await db.query(sql, values);
        
        return {
            order_id: result.insertId,
            customer_id: customer_id,
            ticket_name: ticket_name
        }
    } catch (error) {
        console.error("Error creating new order:", error);
        throw error;
    }
};

// GET Query
const getOrder = async () => {
    const sql = 'SELECT * FROM tbl_orders ORDER BY created_at DESC';
    
    try {
        const [rows] = await db.query(sql);
        return rows;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
    }
};

const getOrderById = async (order_id) => {
    const sql = 'SELECT * FROM tbl_orders WHERE order_id = ?';

    try {
        const [rows] = await db.query(sql, [order_id]);
        return rows[0];
    } catch (error) {
        console.error(`Error fetching order by specific ID ${order_id}:`, error);
        throw error;
    }
};

// UPDATE Queries
const updateStatus = async (order_id, new_status) => {
    const sql = 'UPDATE tbl_orders SET status = ? WHERE order_id = ?';
    const values = [new_status, order_id];
    
    try {
        const [result] = await db.query(sql, values);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error updating status for Order ID ${order_id}`)
        throw error;
    }
};

const updateTotalAmount = async (order_id) => {
    const sql = 'SELECT SUM(line_total) AS new_total FROM tbl_orderdetails WHERE order_id = ?';
    const updateSql = 'UPDATE tbl_orders SET total_amount = ? WHERE order_id = ?';

    try {  
        const[totalResult] = await db.query(sql, [order_id]);
        const newTotal = totalResult[0].new_total || 0;

        await db.query(updateSql, [newTotal, order_id]);
        return newTotal;
    } catch (error) {
        console.error(`Error updating total amount for order: ${order_id}`, error);
        throw error;
    }
}

// DELETE Query
const deleteOrder = async (order_id) => {
    const sql1 = 'DELETE FROM tbl_orderdetails WHERE order_id = ?';
    const sql2 = 'DELETE FROM tbl_orders WHERE order_id = ?';
    
    try {
        await db.query('START TRANSACTION');

        await db.query(sql1, [order_id]);

        const [result] = await db.query(sql2, [order_id]);

        await db.query('COMMIT');
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error deleting order with ID ${order_id}:`, error);
        throw error;
    }
};

module.exports = {
    getOrder,
    getOrderById,
    createOrder,
    deleteOrder,
    updateStatus,
    updateTotalAmount,
}