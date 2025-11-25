const { parse } = require('path');
const orderModel = require('../models/orderModel');
const customersModel = require('../models/customersModel');

const illegalCharsRegex = /^[a-zA-Z\s-&!]+$/;

const validateId = (id) => {
    const parsedId = parseInt(id);
    return !id || !Number.isInteger(parsedId) || parsedId <= 0 ? false : parsedId;
};

const sanitizeTicketName = (ticket_name) => {
    if (ticket_name === null || typeof ticket_name === "undefined") {
        return null;
    }

    if (typeof ticket_name === "string" && ticket_name.trim() === "") {
        return null;
    }

    return ticket_name;
}

const store = async (req, res) => {
    const { customer_id: raw_customer_id = null, ticket_name } = req.body;
    let customer_id = raw_customer_id;

    if (typeof customer_id === 'string' && customer_id.trim() === '') {
        customer_id = null;
    }

    if (customer_id !== null) {
        const parsedId = parseInt(customer_id);

        if (isNaN(parseId) || !Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Customer Id. If provided, it must be a positive integer."
            });
        }
        customer_id = parsedId;
    }

    const finalTicketName = sanitizeTicketName(ticket_name);    
    if (!illegalCharsRegex.test(finalTicketName)) {
        return res.status(400).json({
            success: false,
            message: "ticket_name cannot include invalid characters."
        });
    }

    try {
        if (customer_id !== null) {
            const customerExists = await customersModel.getCustomersById(customer_id)

            if (!customerExists || customerExists.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Customer doesn't exist. Please enter a valid existing customer_id."
                });
            }
        }
        
        const createResult = await orderModel.createOrder(customer_id, finalTicketName);

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
    const { status } = req.body;
    
    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID format. Must be a positive integer."
        });
    } 

    const orderExist = await orderModel.getOrderById(order_id);
    if (!orderExist || orderExist.length === 0) {
        res.status(400).json({
            success: false,
            message: "Order ID does not exist. Input a valid existing order_id."
        })
    }

    if (!status || typeof status !== 'string' || status.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing 'status' value."
        });
    }
    const statusToUpdate = status.toUpperCase();

    const allowedStatuses = ['PENDING', 'PAID', 'CANCELLED', 'COMPLETED'];
    if (!allowedStatuses.includes(status.toUpperCase())) {
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