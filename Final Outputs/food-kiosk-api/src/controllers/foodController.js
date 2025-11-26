//Imports the fooditem Model
const foodModel = require('../models/foodModel');

const validateId = (id) => {
    const parsedId = parseInt(id);
    return !id || !Number.isInteger(parsedId) || parsedId <= 0 ? false : parsedId;
};

const approvedNameRegex = /^[a-zA-Z0-9\s-&!]+$/;

// POST/CREATE/STORE Controller
const store = async (req, res) => {
    const {
        name,
        category_id,
        price, 
        stock, 
        is_available
    } = req.body;

    const trimmedName = name ? String(name).trim() : '';

    if (trimmedName.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Name is required and cannot be empty." 
        });
    }

    if (!approvedNameRegex.test(trimmedName)) { 
        return res.status(400).json({
            success: false,
            message: "Food name contains disallowed characters. Only letters, numbers, spaces, hyphens (-), ampersands (&), and exclamation points (!) are permitted."
        });
    }

    if (category_id === undefined || typeof category_id !== "number" || !Number.isInteger(category_id) || category_id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid category_id. Must be a positive integer."
        });
    } 
    if (price === undefined || typeof price !== "number" || !isFinite(price) || price < 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid price number. Please input valid price number." 
        });
    }

    if (stock === undefined || typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid stock value. Please input valid stock number." 
        });        
    }
        
    if (is_available === undefined || typeof is_available !== "number" || !Number.isInteger(is_available) || (is_available !== 0 && is_available !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_available state. Must be 0 or 1 (integer)." 
        });   
    }

    const itemData = {
        name: trimmedName,
        category_id,
        price,
        stock,
        is_available
    }
    
    try {
        const newFood = await foodModel.createFood(itemData);
        
        return res.status(201).json({
            success: true,
            message: "Food item created successfully.",
            data: newFood
        });
        
    } catch (error) {
        console.log("Error in store controller:", error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
            return res.status(400).json({ 
                success: false,
                message: `Cannot create food item. The category_id (${category_id}) does not exist.`,
                error_code: 1452
            });
        }
        return res.status(500).json({
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
        
        return res.status(200).json({
            success: true,
            data: foodItems
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occured while retrieving food items."
        });
    }
};

const show = async (req, res) => {
    const food_id = validateId(req.params.foodId);

    if (!food_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid food ID format. Must be a positive integer."
        });
    } 

    try {
        const foodItems = await foodModel.getFoodById(food_id);

        if (foodItems.length > 0){
            return res.status(200).json({
                success: true,
                data: foodItems
            });
        } 
        
        return res.status(404).json({
                success: false,
                message: `Food item ID ${food_id} not found.`
            });
            
    } catch (error) {
        console.error("Error in show controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal error has occured while retrieving the food item.",
        });
    }
}

const indexAvailable = async (req, res) => {
    try {
        const foodItems = await foodModel.getAvailableFood();

        if (foodItems.length > 0) {
            return res.status(200).json({
                success: true,
                data: foodItems
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Successfully retrieved available food items (0 items).",
                data: foodItems
            });
        }
    } catch (error) {
        console.error("Error in indexAvailable controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal error has occured while retrieving available food item."
        });
    }
};

const indexByCategory = async (req, res) => {
    const category_id = validateId(req.params.categoryId);

    if (!category_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid category ID format. Must be a positive integer."
        });
    }

    try {
        const foodItems = await foodModel.getFoodByCategory(category_id);

        if (foodItems.length > 0) {
            return res.status(200).json({
                success: true,
                data: foodItems
            });
        } else {
            return res.status(200).json({
                success: true,
                message: `No food items found in category ID ${category_id}`
            });
        }
    } catch (error) {
        console.error("Error in indexByCategory controller:", error);
        return res.status(500).json({
            success: true,
            message: "Failed to retrieve food data by category.",
        })
    }
};

// UPDATE/PUT Controllers
const update = async (req, res) => {
    const food_id = validateId(req.params.foodId);
    
    if (!food_id) {
        return res.status(400).json({
            success: false, 
            message: 'Invalid food ID format. Must be a positive integer.'
        });
    }

    const { 
        name,
        category_id,
        price,
        stock, 
        is_available
    } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid name input. Please input the required and valid food name (text).',
        });
        
    } 
    if (!approvedNameRegex.test(name)) {
        return res.status(400).json({
            success: false,
            message: "Food name must be a text string."
        });
    }

    if (category_id === undefined || typeof category_id !== "number" || category_id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid category_id. Please input valid category_id."
        });
    } 
    if (price === undefined || typeof price !== "number" || price < 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid price number. Please input valid price number." 
        });
    }

    if (stock === undefined || typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid stock value. Please input valid stock number." 
        });        
    }
        
    if (is_available === undefined || typeof is_available !== "number" || !Number.isInteger(is_available) || (is_available !== 0 && is_available !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_available state. Please input valid is_available state." 
        });   
    }
        
    const itemData = {
        name: name.trim(),
        category_id,
        price,
        stock, 
        is_available
    };

    try {            
        //Call the Model function
        const isUpdated = await foodModel.updateFood(food_id, itemData);
        
        if (isUpdated) {        
            if (stock === 0) {
                await foodModel.updateAvailability(food_id, 0);
                itemData.is_available = 0;

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
            const existingFood = await foodModel.getFoodById(food_id);
            if (!existingFood) {
                return res.status(404).json({
                    success: false,
                    message: `Food item ID ${food_id} not found.`
                });
            }
            return res.status(200).json({
                success: true,
                message: `Food item ID ${food_id} updated successfully. No changes detected.`,
                data: existingFood
            });
        }
    } catch (error) {
        console.error("Error in update controller:", error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
            return res.status(400).json({ // 400 Bad Request
                success: false,
                message: `Cannot create food item. The category_id (${category_id}) does not exist.`,
                error_code: 1452
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error:Failed to update food item."
        });
    }
};

const updateStock = async (req, res) => {
    const food_id = validateId(req.params.foodId);
    const { new_stock } = req.body;

    if (!food_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid food ID format. Must be a positive integer."
        });
    }
    if (new_stock === undefined || typeof new_stock !== "number" || !Number.isInteger(new_stock) || new_stock < 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid stock value. Please input a valid non-negative integer for stock."
        });
    }
    try {
        const currentAvailability = await foodModel.getFoodAvailability(food_id);
        const isUpdated = await foodModel.updateStock(food_id, new_stock);

        if (isUpdated) {
            if (new_stock === 0) {
                await foodModel.updateAvailability(food_id, 0);
                return res.status(200).json({
                    success: true,
                    message: `The food id ${food_id} stock updated to 0. Status automatically changed to Out of Stock.`
                });
            }

            if (new_stock > 0 && currentAvailability === 0) {
                await foodModel.updateAvailability(food_id, 1);
                return res.status(200).json({
                    success: true,
                    message: `Stock updated to ${new_stock}. Availability automatically set to 1 (Available) as stock is now positive.`
                })
            }

            return res.status(200).json({
                success: true,
                message: `Stock for food ID ${food_id} updated successfully. Updated stock: ${new_stock}`
            });
        } else {
            const existingFood = await foodModel.getFoodById(food_id);
            if (!existingFood) {
                return res.status(404).json({
                    success: false, 
                    message: `Food ID ${food_id} not found.`
                });
            }
            return res.status(200).json({
                success: true,
                message: `Stock for food ID ${food_id} updated successfully (no change detected).`,
                data: existingFood
            })
        }

    } catch (error) {
        console.error("Error in updateStock controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: Failed to update food stock.",
        });
    }
}

const updateAvailability = async (req, res) => {
    const food_id = validateId(req.params.foodId);

    if (!food_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid food ID format. Must be a positive integer."
        });
    }

    const { is_available } = req.body;

    if (is_available === undefined || typeof is_available !== "number" || (is_available !== 0 && is_available !== 1)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid or missing 'is_available' value. It must be 1 or 0 (integer)."
        });
    }
    try {
        const isUpdated = await foodModel.updateAvailability(food_id, is_available);
        
        if (isUpdated) {
            return res.status(200).json({
                success: true,
                message: `Availability for food ID ${food_id} updated successfully.`
            });
        } else {
            const existingFood = await foodModel.getFoodById(food_id);
            if (!existingFood) {
                return res.status(404).json({
                    success: false, 
                    message: `Food ID ${food_id} not found.`
                });
            }

            return res.status(200).json({
                success: true,
                message: `Availability for food ID ${food_id} updated successfully (no change detected).`,
                data: existingFood
            });
        }
    } catch (error) {
        console.error("Error in toggleAvailability controller:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update food availability."
        });
    }
}

// DELETE/DESTROY Controller
const destroy = async (req, res) => {
    const food_id = validateId(req.params.foodId);
    if (!food_id) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid food ID format. Must be a positive integer.'});
    }

    try {
        const isDeleted = await foodModel.deleteFood(food_id);

        if (isDeleted) {
            return res.status(204).end();
        } else {
            return res.status(404).json({
                success: false,
                message: `Food item ID ${food_id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in destroy controller:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove food item."
        });
    }
}

module.exports = {
    store,
    index,
    show,
    indexAvailable,
    indexByCategory,
    update,
    updateStock,
    updateAvailability,
    destroy,
};