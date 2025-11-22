const db = require('../config/database');

const createOrderDetail = async (order_id, food_id, quantity, price_at_order) => {
    try {
        const sql = 'INSERT INTO tbl_orderdetails (order_id, food_id, quantity, price_at_order) VALUES (?, ?, ?, ?)';
    
        const values = [order_id, food_id, quantity, price_at_order];

        const [result] = await db.query(sql, values);

        return result.insertId;
    } catch (error) {
        console.error("Error in creating order details;", error);
        throw error;
    }
};

const updateDetail = async (detail_id, quantity, lineItemTotal) => {
    try {
        const sql = 'UPDATE tbl_orderdetails SET quantity = ?, price_at_order = ? WHERE order_detail_id = ?';

        const values = [quantity, lineItemTotal, detail_id]
        const [rows] = await db.query(sql, values);

        return rows;
    } catch (error) {
        console.error("Error in updating order details:", error);
        throw error;
    }
};

const getDetailById = async (order_id, detail_id) => {
    try {
        const sql = 'SELECT order_detail_id, order_id, food_id, quantity, price_at_order FROM tbl_orderdetails WHERE order_detail_id = ? AND order_id = ?';
        
        const [rows] = await db.query(sql, [detail_id, order_id]);
        return rows;
    } catch (error) {
        console.error("Error in fetching detail by order id:", error);
        throw error;
    }
};

const getDetailByOrderId = async (order_id) => {
    try {
        const sql = 'SELECT order_detail_id, order_id, food_id, quantity, price_at_order FROM tbl_orderdetails WHERE order_id = ? ORDER BY created_at DESC';
        
        const [rows] = await db.query(sql, [order_id]);
        return rows;
    } catch (error) {
        console.error("Error in fetching detail by order id:", error);
        throw error;
    }
};

const deleteDetail = async (order_id, detail_id) => {
    try {
        const sql = 'DELETE FROM tbl_orderdetails WHERE order_id = ? AND order_detail_id = ?';

        const [remove] = await db.query(sql, [order_id, detail_id]);
        return remove.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting order with detail ID:", error);
        throw error;
    }
};

module.exports = {
    createOrderDetail,
    updateDetail,
    getDetailById,
    getDetailByOrderId,
    deleteDetail,
};