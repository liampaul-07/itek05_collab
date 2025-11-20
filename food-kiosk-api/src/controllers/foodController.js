//Imports the fooditem Model
const foodModel = require('../models/foodModel');

const index = async (req, res) => {
    try {
        //Calls the model func to get the data from database. 
        const foodItems = await foodModel.getFood();
        
        //If it's successful, sends the data back to the client with a 200 OK status. If it returns an error, goes into catch.
        res.status(200).json({
            success: true,
            message: "All food items retrieved successfully.",
            data: foodItems,
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        res.status(500).json({
            success: false,
            message: "An internal server error occured while retrieving food items.",
            details: error.message
        });
    }
};

const store = async (req, res) => {
    try {
        //This is the data sent by the client
        const itemData = req.body;

        //Calls the model to add data, gets back new IDs
        const newId = await foodModel.createFood(itemData);

        res.status(201).json({
            success: true,
            message: "Food item created successfully.",
            id: newId
        });
    } catch (error) {
        console.log("Error in store controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create food item.",
            details: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        //Gets the ID from the URL path
        const id = req.params.id;

        //Get the updated data from the request body
        const itemData = req.body;

        //Call the Model function
        const wasUpdated = await foodModel.updateFood(id, itemData);

        if (wasUpdated) {
            res.status(200).json({
                success: true,
                message: `Food item ID ${id} updated successfully`
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Food item ID ${id} not found. No changes were made.`
            });
        }
    } catch (error) {
        console.error("Error in update controller:", error);
        res.status(400).json({
            success: false,
            message: "Failed to update food item.",
            details: error.message
        });
    }
};

const destroy = async (req, res) => {
    try {
        //Gets the id
        const id = req.params.id;

        //Becomes true if the method returns true
        const wasDeleted = await foodModel.deleteFood(id);

        //If deleted, gives success message, not if else.
        if (wasDeleted) {
            res.status(200).json({
                message: `Food item ID ${id} was removed successfully.`
            });
        } else {
            res.status(404).json({
                message: `Food item ID ${id} not found.`
            });
        }
    } catch (error) {
        console.error("Errr in destroy controller:", error);
        res.status(500).json({
            message: "Failed to remove food item.",
            details: error.message
        });
    }
}

const indexById = async (req, res) => {
    try {
        const id = req.params.id;
        const foodItems = await foodModel.getFoodById(id);

        if (foodItems.length > 0){
            res.status(200).json(foodItems);
        } else {
            res.status(404).json({
                message: `Food item ID ${id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in indexById controller:", error);
        res.status(500).json({
            message: "Failed to retrieve food item.",
            details: error.message
        });
    }
}

const indexAvailable = async (req, res) => {
    try {
        const foodItems = await foodModel.getAvailableFood();

        if (foodItems.length > 0) {
            res.status(200).json(foodItems);
        } else {
            res.status(404).json({
                message: "No food items are currently available"
            });
        }
    } catch (error) {
        console.error("Error in indexAvailable controller:", error);
        res.status(500)({
            message: "Failed to retrieve available food data.",
            details: error.message
        })
    }
};

const indexByCategory = async (req, res) => {
    try {
        const category_id = req.params.id;
        
        const foodItems = await foodModel.getFoodByCategory(category_id);

        if (foodItems.length > 0) {
            res.status(200).json(foodItems);
        } else {
            res.status(404).json({
                message: `No food items found for Category ID ${id}`
            });
        }
    } catch (error) {
        console.error("Error in indexByCategory controller:", error);
        res.status(500)({
            message: "Failed to retrieve food data by category.",
            details: error.message
        })
    }
};

const updateStock = async (req, res) => {
    try {
        const id = req.params.id;
        const { new_stock } = req.body;


        if (new_stock === undefined || isNaN(new_stock)) {
            return res.status(400).json({
                message: "Invalid or missing stock value."
            });
        }

        const success = await foodModel.updateStock(id, new_stock);
        
        if (success) {
            res.status(200).json({
                message: `Stock for food ID ${id} updated successfully.`
            });
        } else {
            res.status(404).json({
                message: `Food ID ${id} not found.`
            })
        }
    } catch (error) {
        console.error("Error in updateStock controller:", error);
        res.status(500).json({
            message: "Failed to update food stock.",
            details: error.message
        });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const id = req.params.id;
        const { is_available } = req.body;

        if (is_available === undefined || (is_available !== 0 && is_available !== 1)) return res.status(400).json({ message: "Invalid or missing 'is_available' value. It must be 1 or 0."});

        const success = await foodModel.updateAvailability(id, is_available);
        
        if (success) {
            res.status(200).json({
                message: `Availability for food ID ${id} updated successfully.`
            })
        } else {
            res.status(404).json({
                message: `Food item ID ${id} not found.`
            });
        }
    } catch (error) {
        console.error("Error in toggleAvailability controller:", error);
        res.status(500).json({
            message: "Failed to update food availability.",
            details: error.message
        });
    }
}

module.exports = {
    index,
    store,
    update,
    destroy,
    indexById,
    indexAvailable,
    indexByCategory,
    updateStock,
    updateAvailability,
};