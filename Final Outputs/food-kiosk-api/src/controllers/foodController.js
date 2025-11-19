//Imports the fooditem Model
const foodModel = require('../models/foodModel');

const getAllFoodItems = async (req, res) => {
    try {
        //Calls the model func to get the data from database. 
        const foodItems = await foodModel.getAll();
        
        //If it's successful, sends the data back to the client with a 200 OK status. If it returns an error, goes into catch.
        res.status(200).json(foodItems);
    } catch (error) {
        console.error("Error in getAllFoodItems controller:", error);
        res.status(500).json({
            message: "An internal server error occured while retrieving food items.",
            details: error.message
        });
    }
};

//Exports the getAllFoodItems function so the route file can use it.
module.exports = {
    getAllFoodItems,
};