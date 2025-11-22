const orderDetailModel = require('../models/orderDetailModel');
const orderModel = require('../models/orderModel');
const foodModel = require('../models/foodModel');

const store = async (req, res) => {
    try {
        const { food_id, quantity } = req.body;
        const orderId = req.params.id;
        
        if ((food_id === undefined || isNaN(food_id) || food_id <= 0) || (quantity === undefined || isNaN(quantity) || quantity <= 0)) {
            res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        const foodItem =  await foodModel.getFoodById(food_id);
        const foodName = foodItem[0].name;
        
        if (!foodItem) {
            res.status(404).json({
                success: false,
                message: "Food item not found."
            });
        }

        const unitPrice = foodItem[0].price;
        const lineItemTotal = unitPrice * quantity;

        const newDetailId = await orderDetailModel.createOrderDetail(orderId, food_id, quantity, lineItemTotal);

        const newTotalAmount = await orderModel.updateTotalAmount(orderId);

        res.status(201).json({
            success: true,
            message: "Order added successfully",
            
            food_name: foodName,
            detail_id: newDetailId,

            price_at_order: lineItemTotal,
            newTotalAmount: newTotalAmount,      
        });
    } catch (error) {
        console.error("Error in store (add detail) controller:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to add item to order."
        });
    }
};

const update = async (req, res) => {
    try {
        const { quantity, food_id } = req.body;
        const orderId = req.params.orderId;
        const detail_id = req.params.detailId;

        if (!orderId || !detail_id || !quantity || !food_id) {
            res.status(400).json({
                success: false,
                message: "Missing required input fields."
            })
        } else if (quantity <= 0 || food_id <= 0 || detail_id <= 0 || orderId <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid input."
            })
        }
        
        const foodItem = await foodModel.getFoodById(food_id);

        if (!foodItem || foodItem.length === 0) {
            res.status(404).json({
                success: false,
                message: "Food item not found."
            });
        }

        const price = foodItem[0].price;
        const foodName = foodItem[0].name;
        const newLineItemTotal = price * quantity;
        
        const result = await orderDetailModel.updateDetail(detail_id, quantity, newLineItemTotal); 

        if (result.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "Item may not exist in the order."
            });
        }

        const newTotalAmount = await orderModel.updateTotalAmount(orderId);

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            
            food_name: foodName,
            detail_id: detail_id,

            price_at_order: newLineItemTotal,
            new_total_amount: newTotalAmount,      
        });
    } catch (error) {
        console.error("Error in updating order detail:", error);
        throw error;
    }
};

const indexByDetailId = async (req, res) => {
    try {
        const detail_id = req.params.detailId;
        const order_id = req.params.orderId;

        const indexDetailId = await orderDetailModel.getDetailById(order_id,detail_id);

        if (!indexDetailId) {
            res.status(404).json({
                status: false,
                message: `Order Details ID: ${id} not found.`
            });
        } else {
            res.status(200).json({
                status: true,
                message: `Successfully retrieved Order Detail ID: ${detail_id}`,
                data: indexDetailId
            });
        } 
    } catch (error) {
        console.error("Error in indexByDetailId controler:", error);
        res.status(500).json({
            status: false,
            message: "Failed to retrieve order detail."
        });
    }
};

const indexByOrderId = async (req, res) => {
    try {
        const order_id = req.params.orderId;

        const indexOrderId = await orderDetailModel.getDetailByOrderId(order_id);
        
        if (!indexOrderId) {
            res.status(404).json({
                status: false,
                message: `Order ID: ${id} not found.`
            });
        } else {
            res.status(200).json({
                status: true,
                message: `Successfully retrieved Order ID: ${order_id}`,
                data: indexOrderId
            });
        } 
    } catch (error) {
        console.error("Error in indexByOrderId controler:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve order detail."
        });
    }
};

const destroy = async (req, res) => {
    try {
        const detail_id = req.params.detailId;
        const order_id = req.params.orderId;

        const successDel = await orderDetailModel.deleteDetail(order_id, detail_id);

        if (successDel === 0) {
            res.status(404).json({
                success: false,
                message: `Order Detail ID: ${detail_id} not found.`
            });
        } else {
            res.status(200).json({
                success: true,
                message:`Record with Order Detail ID: ${detail_id} has been completely removed.`
            });
        }
    } catch (error) {
        console.error("Error in destroy controller.", error);
        throw error;
    }
};

module.exports = {
    store,
    update,
    indexByOrderId,
    indexByDetailId,
    destroy,
};