const orderDetailModel = require('../models/orderDetailModel');
const orderModel = require('../models/orderModel');
const foodModel = require('../models/foodModel');
const { parse } = require('path');

const validateId = (id) => {
    const parsedId = parseInt(id);
    return !id || !Number.isInteger(parsedId) || parsedId <= 0 ? false : parsedId;
};

const store = async (req, res) => {
    const { food_id, quantity } = req.body;
    const order_id = validateId(req.params.orderId);
    const parsedFoodId = validateId(food_id);
    const parsedQuantity = validateId(quantity);

    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order ID format. Must be a positive integer.'
        });
    }
    if (!parsedFoodId) {
        return res.status(400).json({
            success: false,
            message: "Invalid food_id value. It must be a positive integer."
        });
    }
    if (!parsedQuantity) {
        return res.status(400).json({
            success: false,
            message: "Invalid quantity value. It must be a positive integer."
        });
    }

    try {    
        const foodItemResult =  await foodModel.getFoodById(parsedFoodId);
        
        if (!foodItemResult || foodItemResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food item not found."
            });
        }

        // Contains one record of food item.
        const foodItem = foodItemResult[0];

        if (foodItem.is_available !== 1) { 
            return res.status(400).json({
                success: false,
                message: `Food ID ${parsedFoodId} is currently not available for order.`
            });
        }
        
        if (foodItem.stock < parsedQuantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Only ${foodItem.stock} unit(s) of ${foodItem.name} remaining.`
            });
        }

        // Gets the individual columns of the food item.
        const foodName = foodItem.name;
        const unitPrice = parseFloat(foodItem.price);
        const lineItemTotal = unitPrice * parsedQuantity;

        if (isNaN(unitPrice)) {
            return res.status(500).json({
                success: false, 
                message: "Database returned an invalid price format for the food item."
            })
        }

        const newDetailId = await orderDetailModel.createOrderDetail(order_id, parsedFoodId, parsedQuantity, unitPrice, lineItemTotal);

        await foodModel.adjustStock(parsedFoodId, -parsedQuantity);
        
        let finalTotalAmount = await orderModel.updateTotalAmount(order_id);
        finalTotalAmount = parseFloat(finalTotalAmount);

        if (isNaN(finalTotalAmount)) {
            return res.status(500).json({
                success: false,
                message: "Database failed to calculate or return the new order total amount."
            });
        }

        return res.status(201).json({
            success: true,
            message: "Item added to order successfully",
            
            data: {
                order_detail_id: newDetailId,
                receipt_item: {
                    food_name: foodName,
                    quantity: parsedQuantity,
                    unit_price: unitPrice.toFixed(2),
                    line_item_total: lineItemTotal.toFixed(2)
                },
                new_order_total: finalTotalAmount.toFixed(2)
            }
        });
    } catch (error) {
        console.error("Error in store (add detail) controller:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error during orderdetail creation."
        });
    }
};

const update = async (req, res) => {
    const { quantity, food_id } = req.body;
    const order_id = validateId(req.params.orderId);
    const detail_id = validateId(req.params.detailId);
    
    const newQuantity = validateId(quantity);
    const newFoodId = validateId(food_id);

    if (!order_id || !detail_id || !newQuantity || newQuantity <= 0 || !newFoodId || newFoodId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input: IDs and Quantity must be positive integers.'
        });
    }

    try {
        const oldDetailResult = await orderDetailModel.getDetailById(order_id, detail_id);
        
        if (!Array.isArray(oldDetailResult) || oldDetailResult.length === 0){
            return res.status(404).json({
                success: false,
                message: "Order detail item not found."
            });
        }
        
        const oldDetail = oldDetailResult[0];

        if (parseFloat(oldDetail.food_id) !== parseFloat(newFoodId)) {
            return res.status(400).json({
                success: false,
                message: "Changing food_id is not allowed in this update route. Delete and re-add instead."
            });
        }
        
        const oldQuantity = parseFloat(oldDetail.quantity);
        const stockAdjustment = oldQuantity - newQuantity;

        const foodItemResult = await foodModel.getFoodById(newFoodId);

        if (!foodItemResult || foodItemResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food item not found."
            });
        }

        const foodItem = foodItemResult[0];
        const foodName = foodItem.name;
        
        const unitPrice = parseFloat(foodItem.price)
        const newLineItemTotal = unitPrice * newQuantity;
        
        const result = await orderDetailModel.updateDetail(
            detail_id,
            newQuantity, 
            unitPrice,
            newLineItemTotal
        ); 

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Order detail item not found for update."
            });
        }
        
        await foodModel.adjustStock(newFoodId, stockAdjustment);
        
        let finalTotalAmount = await orderModel.updateTotalAmount(order_id);
        finalTotalAmount = parseFloat(finalTotalAmount);

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            
            data: {
                detail_id: detail_id,
                receipt_item: {
                    food_name: foodName,
                    quantity: newQuantity,
                    unit_price: unitPrice.toFixed(2),
                    line_item_total: newLineItemTotal.toFixed(2)
                },
                new_order_total: finalTotalAmount.toFixed(2)
            }     
        });
    } catch (error) {
        console.error("Error in updating order detail:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during order detail update."
        })
    }
};

const showDetailId = async (req, res) => {
    const detail_id = validateId(req.params.detailId);
    const order_id = validateId(req.params.orderId); 

    if (!detail_id) {
        return res.status(400).json({
            success: false,
            message: 'Invalid detail ID format. Must be a positive integer.'
        });
    }
    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order ID format. Must be a positive integer.'
        });
    }

    try {
        const orderDetail = await orderDetailModel.getDetailById(order_id, detail_id);

        if (!orderDetail) {
            return res.status(404).json({
                success: false,
                message: `Order Details ID: ${detail_id} not found in OrderID: ${order_id}.`
            });
        } 
        return res.status(200).json({
            success: true,
            message: `Successfully retrieved Order Detail ID: ${detail_id}`,
            data: orderDetail
        });

    } catch (error) {
        console.error("Error in showDetailId controler:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve order detail due to an internal server error."
        });
    }
};

const indexByOrderId = async (req, res) => {
    const order_id = validateId(req.params.orderId);
    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order ID format. Must be a positive integer.'
        });
    }

    try {
        const indexOrderId = await orderDetailModel.getDetailByOrderId(order_id);
        
        if (!indexOrderId || indexOrderId.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No order details found for Order ID: ${order_id}.`
            });
        } 

        res.status(200).json({
            success: true,
            message: `Successfully retrieved ${indexOrderId.length} detail lines for Order ID: ${order_id}`,
            data: indexOrderId
        });
         
    } catch (error) {
        console.error("Error in indexByOrderId controler:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve order details due to server error."
        });
    }
};

const destroy = async (req, res) => {
    const detail_id = validateId(req.params.detailId);
    const order_id = validateId(req.params.orderId);
    
    if (!detail_id || !order_id) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format. Must be a positive integer.'
        });
    }


    try {
        const detailData = await orderDetailModel.getDetailById(order_id, detail_id);

        if (!Array.isArray(detailData) || detailData.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Order Detail ID: ${detail_id} not found in Order ID: ${order_id}.`
            });
        }
        const { food_id, quantity } = detailData[0];

        await orderDetailModel.deleteDetail(order_id, detail_id);
        
        await foodModel.adjustStock(food_id, quantity);
        
        let finalTotalAmount = await orderModel.updateTotalAmount(order_id);
        finalTotalAmount = parseFloat(finalTotalAmount) || 0;
        return res.status(200).json({
            success: true,
            message:`Order Detail ID: ${detail_id} successfully removed. Stock refunded.`,
            data: {
                refunded_item: {
                    food_id: food_id,
                    quantity: quantity,
                },
                new_order_total: finalTotalAmount.toFixed(2)
            }
        });
        
    } catch (error) {
        console.error("Error in destroy controller.", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during order detail deletion."
        })
    }
};

module.exports = {
    store,
    update,
    indexByOrderId,
    showDetailId,
    destroy,
};