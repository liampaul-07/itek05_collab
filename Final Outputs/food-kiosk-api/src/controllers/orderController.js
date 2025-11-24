const { parse } = require('path');
const orderModel = require('../models/orderModel');

const validateId = (id) => {
    const parsedId = parseInt(id);
    return !id || !Number.isInteger(parsedId) || parsedId <= 0 ? false : parsedId;
};

const store = async (req, res) => {
    const { initCustomerId, initTicketName } = req.body;
    const finalCustomerId = initCustomerId || null;
    const finalTicketName = initTicketName || null;

    if (finalCustomerId !== null && (isNaN(finalCustomerId) || parseInt(finalCustomerId) <= 0)){
        return res.status(400).json({
            success: false, 
            message: "Invalid Customer ID."
        });
    }

    if (finalTicketName !== null && (typeof finalTicketName !== 'string' || finalTicketName.length > 50)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ticket name length/type."
        });
    }

    try {
        const createResult = await orderModel.createOrder(finalCustomerId, finalTicketName);

        if (createResult && createResult.order_id) {
            res.status(201).json({
                success: true,
                message: "Order created successfully",
                order_id: createResult.order_id,
                customer_id: createResult.customer_id,
                ticket_name: createResult.ticket_name
            });
        }
    } catch (error) {
        console.error("Error in store controller:", error);
        res.status(500).json({
            success: false,
            message: "Order creation failed or returned empty result."
        });
    }
};

const index = async (req, res) => {
    try {
        const orders = await orderModel.getOrder();
        
        res.status(200).json({
            success: true,
            message: 'All orders retrieved successfully',
            data: orders
        });
        
    } catch (error) {
        console.error("Error in index controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve all orders."
        });
    }
}

const show = async (req, res) => {
    const order_id = validateId(req.params.orderId);
    
    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID format. Must be a positive integer."
        });
    } 

    try {    
        const order = await orderModel.getOrderById(order_id);

        if (order) {
            res.status(200).json({
                success: true,
                message: `Order ID ${order_id} successfully retrieved`,
                data: order
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order ID ${order_id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in show controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve order."
        });
    }
};

const updateStatus = async (req, res) => {
    const order_id = validateId(req.params.orderId);
    const { new_status } = req.body;
    const statusToUpdate = new_status.toUpperCase();
    
    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID format. Must be a positive integer."
        });
    } 
    if (!new_status || typeof new_status !== 'string' || new_status.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing 'new_status' value."
        });
    }

    const allowedStatuses = ['PENDING', 'PAID', 'CANCELLED', 'COMPLETED'];
    if (!allowedStatuses.includes(new_status.toUpperCase())) {
        return res.status(400).json({
            success: false,
            message: `Invalid status value. Must be one of: ${allowedStatuses.join(', ')}.`
        });
    }

    try {
        const success = await orderModel.updateStatus(order_id, statusToUpdate);
        if (success){
            res.status(200).json({
                success: true,
                message: `Status for ORDER ID ${order_id} updated to ${statusToUpdate} successfully.`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order ID ${order_id} not found.`
            });
        }  
    } catch (error) {
        console.error("Error in updateStatus controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};

const destroy = async (req, res) => {
    const order_id = validateId(req.params.orderId);
    
    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID format. Must be a positive integer."
        });
    } 

    try {
        const success = await orderModel.deleteOrder(order_id);

        if (success) {
            res.status(204).end();
        } else {
            res.status(404).json({
                success: false,
                message: `Order ID ${order_id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in destroy controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete order."
        });
    }
};

module.exports = {
    index,
    show,
    store,
    destroy,
    updateStatus,
};