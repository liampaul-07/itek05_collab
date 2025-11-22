//Imports the fooditem Model
const foodModel = require('../models/foodModel');

// POST/CREATE/STORE Controller
const store = async (req, res) => {
    try {
        //Gets the itemData in the request
        const itemData = req.body;

        //Calls the model to add data, gets back new ID
        const newFoodId = await foodModel.createFood(itemData);

        res.status(201).json({
            success: true,
            message: "Food item created successfully.",
            newFoodId: newFoodId
        });
    } catch (error) {
        console.log("Error in store controller:", error);
        res.status(500).json({
            success: false,
            message: "An internal error occurred while creating a new food item.",
        });
    }
};

// GET/READ/INDEX Controllers
const index = async (req, res) => {
    try {
        //Indexes all the Food Items
        const foodItems = await foodModel.getFood();
        
        res.status(200).json({
            success: true,
            data: foodItems
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        res.status(500).json({
            success: false,
            message: "An internal server error occured while retrieving food items."
        });
    }
};

const indexById = async (req, res) => {
    try {
        const food_id = req.params.foodId;

        if (food_id < 0) {
            res.status(400).json({
                status: false,
                message: "Invalid input. Please put valid food_id."
            })
        } 

        const foodItems = await foodModel.getFoodById(food_id);

        if (foodItems.length > 0){
            res.status(200).json({
                success: true,
                data: foodItems
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Food item ID ${food_id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in indexById controller:", error);
        res.status(500).json({
            success: false,
            message: "An internal error has occured while retrieving the food item.",
        });
    }
}

const indexAvailable = async (req, res) => {
    try {
        const foodItems = await foodModel.getAvailableFood();

        if (foodItems.length > 0) {
            res.status(200).json({
                success: true,
                data: foodItems
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Successfully retrieved available food items (0 items).",
                data: foodItems
            });
        }
    } catch (error) {
        console.error("Error in indexAvailable controller:", error);
        res.status(500)({
            success: false,
            message: "An internal error has occured while retrieving available food item."
        });
    }
};

const indexByCategory = async (req, res) => {
    try {
        const category_id = req.params.categoryId;
        
        const foodItems = await foodModel.getFoodByCategory(category_id);

        if (foodItems.length > 0) {
            res.status(200).json({
                success: true,
                data: foodItems
            });
        } else {
            res.status(200).json({
                success: true,
                message: `No food items found in category ID ${id}`
            });
        }
    } catch (error) {
        console.error("Error in indexByCategory controller:", error);
        res.status(500)({
            success: true,
            message: "Failed to retrieve food data by category.",
        })
    }
};

// UPDATE/PUT Controllers
const update = async (req, res) => {
    try {
        const food_id = req.params.foodId;
        const { 
            name,
            category_id,
            price,
            stock, 
            is_available
        } = req.body;

        
        if (category_id === undefined || isNaN(category_id) || category_id <= 0) {
            return res.status(400).json({
                status: false,
                message: "Invalid category_id. Please input valid category_id."
            });
        } 
        if (price === undefined || isNaN(price) || price < 0) {
            return res.status(400).json({ 
                status: false, 
                message: "Invalid price number. Please input valid price number." 
            });
        }

        if (stock === undefined || isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({ 
                status: false, 
                message: "Invalid stock value. Please input valid stock number." 
            });        
        }
        
        if (is_available === undefined || (is_available !== 0 && is_available !== 1)) {
            return res.status(400).json({ 
                status: false, 
                message: "Invalid is_available state. Please input valid is_available state." 
            });   
        }
        
        const itemData = {
            name,
            category_id,
            price,
            stock, 
            is_available
        };

        //Call the Model function
        const isUpdated = await foodModel.updateFood(food_id, itemData);
        
        if (isUpdated) {        
            if (stock === 0) {
                await foodModel.updateAvailability(food_id, 0);
                const updatedFoodItem = await foodModel.getFoodById(food_id);
                return res.status(200).json({
                    success: true,
                    message: `Food item ID ${food_id} updated successfully.`,
                    note: "Availability status was automatically set to 0 (Unavailable) due to stock being 0.",
                    data: updatedFoodItem
                });
            }

            const updatedFoodItem = await foodModel.getFoodById(food_id);
            return res.status(200).json({
                success: true,
                message: `Food item ID ${food_id} updated successfully`,
                data: updatedFoodItem
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Food item ID ${food_id} not found. No changes were made.`
            });
        }
    } catch (error) {
        console.error("Error in update controller:", error);
        res.status(400).json({
            success: false,
            message: "Failed to update food item."
        });
    }
};

const updateStock = async (req, res) => {
    try {
        const food_id = req.params.foodId;
        const { new_stock } = req.body;

        if (new_stock === undefined || isNaN(new_stock) || new_stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock value. Please input a valid  stock number."
            });
        }

        const isUpdated = await foodModel.updateStock(food_id, new_stock);
        if (isUpdated) {
            if (new_stock === 0) {
                await foodModel.updateAvailability(food_id, 0);
                res.status(200).json({
                    success: true,
                    message: `The food id ${food_id} status is updated: Out of stocks.`
                });
            }
            res.status(200).json({
                success: true,
                message: `Stock for food ID ${food_id} updated successfully. Updated stock: ${new_stock}`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Food ID ${food_id} not found.`
            })
        }

    } catch (error) {
        console.error("Error in updateStock controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update food stock.",
        });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const food_id = req.params.foodId;
        const { is_available } = req.body;

        if (is_available === undefined || (is_available !== 0 && is_available !== 1)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid or missing 'is_available' value. It must be 1 or 0."
            });
        }
        const isUpdated = await foodModel.updateAvailability(food_id, is_available);
        
        if (isUpdated) {
            res.status(200).json({
                success: true,
                message: `Availability for food ID ${food_id} updated successfully.`
            })
        } else {
            res.status(404).json({
                success: false,
                message: `Food item ID ${food_id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in toggleAvailability controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update food availability."
        });
    }
}

// DELETE/DESTROY Controller
const destroy = async (req, res) => {
    try {
        const food_id = req.params.foodId;
        const isDeleted = await foodModel.deleteFood(food_id);

        if (isDeleted) {
            res.status(204).end();
        } else {
            res.status(404).json({
                message: `Food item ID ${id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in destroy controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove food item."
        });
    }
}

module.exports = {
    store,
    index,
    indexById,
    indexAvailable,
    indexByCategory,
    update,
    updateStock,
    updateAvailability,
    destroy,
};