const db = require('../config/database');

const getOrder = async () => {
    try {
        const sql = 'SELECT * FROM tbl_orders ORDER BY created_at DESC';
        const [rows] = await db.query(sql);
        return rows;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
    }
};

const getOrderById = async (id) => {
    try {
        const sql = 'SELECT * FROM tbl_orders WHERE order_id = ? ORDER BY created_at DESC';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error(`Error fetching order by specific ID ${id}:`, error);
        throw error;
    }
};

const createOrder = async (total_amount) => {
    try {
        const sql = 'INSERT INTO tbl_orders (total_amount) VALUES (?)';
        const [result] = await db.query(sql, [total_amount]);

        //Returns the ID of the new order
        return result.insertId;
    } catch (error) {
        console.error("Error creating new order:", error);
        throw error;
    }
};

const deleteOrder = async (id) => {
    try {
        const sql = 'DELETE FROM tbl_orders WHERE order_id = ?';
        const [result] = await db.query(sql, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error deleting order with ID ${id}:`, error);
        throw error;
    }
}

const updateStatus = async (id, new_status) => {
    try {
        const sql = 'UPDATE tbl_orders SET status = ? WHERE order_id = ?';
        const [result] = await db.query(sql, [new_status, id]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error updating status for Order ID ${id}`)
        throw error;
    }
}

module.exports = {
    getOrder,
    getOrderById,
    createOrder,
    deleteOrder,
    updateStatus,
}