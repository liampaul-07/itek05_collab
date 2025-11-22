const orderModel = require('../models/orderModel');

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

const indexById = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await orderModel.getOrderById(id);

        if (order) {
            res.status(200).json({
                status: true,
                message: `Order ID ${id} successfully retrieved`,
                data: order
            });
        } else {
            res.status(404).json({
                status: false,
                message: `Order ID ${id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in indexById controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve order."
        });
    }
};

const store = async (req, res) => {
    try {
        const { total_amount } = req.body;

        // if (!total_amount || isNaN(total_amount) || total_amount < 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid total_amount."
        //     });
        // } 

        const newId = await orderModel.createOrder(total_amount);

        res.status(201).json({
            success: true,
            message: "Order finished successfully",
            order_id: newId,
            total_amount: total_amount
        });
    } catch (error) {
        console.error("Error in store controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });
    }
};

const destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const success = await orderModel.deleteOrder(id);

        if (success) {
            res.status(200).json({
                success: true,
                message: `Record with Order ID: ${id} has been completely removed.`
            })
        } else {
            res.status(404).json({
                success: false,
                message: `Order ID ${id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in destroy controller:", error);
        if (error.message.includes('ER_ROW_IS_REFERENCED')){
            return res.status(409).json({
                success: false,
                message: `Record with Order ID ${id} cannot be deleted as it has existing order details.`
            })
        }
        res.status(500).json({
            success: false,
            message: "Failed to delete order."
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { new_status } = req.body;

        if (!new_status || typeof new_status !== 'string' || new_status.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing 'new_status' value."
            });
        }

        const success = await orderModel.updateStatus(id, new_status);
        if (success){
            res.status(200).json({
                success: true,
                message: `Status for ORDER ID ${id} updated to ${new_status} successfully.`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Order ID ${id} not found.`
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

module.exports = {
    index,
    indexById,
    store,
    destroy,
    updateStatus,
};