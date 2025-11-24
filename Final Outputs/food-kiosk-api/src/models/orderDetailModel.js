const db = require('../config/database');

const createOrderDetail = async (order_id, food_id, quantity, unit_price, line_total) => {
    const sql = 'INSERT INTO tbl_orderdetails (order_id, food_id, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?)';
    const values = [order_id, food_id, quantity, unit_price, line_total];

    try {
        const [result] = await db.query(sql, values);
        return result.insertId;
    } catch (error) {
        console.error("Error in creating order details;", error);
        throw error;
    }
};

const updateDetail = async (detail_id, quantity, unit_price, line_item_total) => {
    const sql = 'UPDATE tbl_orderdetails SET quantity = ?, unit_price = ?, line_total = ? WHERE order_detail_id = ?';
    const values = [quantity, unit_price, line_item_total, detail_id];
        
    try {
        const [rows] = await db.query(sql, values);
        return rows;
    } catch (error) {
        console.error("Error in updating order details:", error);
        throw error;
    }
};

const getDetailById = async (order_id, detail_id) => {
    const sql = `
        SELECT 
            td.order_detail_id,
            td.order_id, 
            td.food_id, 
            td.quantity, 
            td.unit_price,
            td.line_total 
        FROM 
            tbl_orderdetails td 
        JOIN
            tbl_fooditems tf ON td.food_id = tf.food_id
        WHERE 
            td.order_detail_id = ? AND td.order_id = ?`;
    const values = [detail_id, order_id]

    try {    
        const [rows] = await db.query(sql, values);
        return rows[0];
    } catch (error) {
        console.error("Error in fetching detail by order id:", error);
        throw error;
    }
};

const getDetailByOrderId = async (order_id) => {
    const sql = `
        SELECT 
            td.order_detail_id, 
            td.order_id, 
            td.food_id, 
            tf.name AS food_name, 
            td.quantity, 
            td.unit_price, 
            td.line_total
        FROM 
            tbl_orderdetails td
        JOIN 
            tbl_fooditems tf ON td.food_id = tf.food_id
        WHERE 
            td.order_id = ? 
        ORDER BY 
            td.order_detail_id ASC`;
    try {    
        const [rows] = await db.query(sql, [order_id]);
        return rows;
    } catch (error) {
        console.error("Error in fetching detail by order id:", error);
        throw error;
    }
};

const deleteDetail = async (order_id, detail_id) => {
    const sql = 'DELETE FROM tbl_orderdetails WHERE order_id = ? AND order_detail_id = ?';
    const values = [order_id, detail_id];

    try {
        const [remove] = await db.query(sql, values);
        return remove.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting order with detail ID:", error);
        throw error;
    }
};

module.exports = {
    createOrderDetail,
    getDetailById,
    getDetailByOrderId,
    updateDetail,
    deleteDetail,
};