//Imports the fooditem Model
const foodModel = require('../models/foodModel');

const index = async (req, res) => {
    try {
        //Calls the model func to get the data from database. 
        const foodItems = await foodModel.getFood();
        
        //If it's successful, sends the data back to the client with a 200 OK status. If it returns an error, goes into catch.
        res.status(200).json(foodItems);
    } catch (error) {
        console.error("Error in index controller:", error);
        res.status(500).json({
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
            id: newId,
            message: "Food item created successfully."
        });
    } catch (error) {
        console.log("Error in store controller:", error);
        res.status(500).json({
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
                message: `Food item ID ${id} updated successfully`
            });
        } else {
            res.status(400).json({
                message: `Food item ID ${id} not found. No changes were made.`
            });
        }
    } catch (error) {
        console.error("Error in update controller:", error);
        res.status(400).json({
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

module.exports = {
    index,
    store,
    update,
    destroy,
};