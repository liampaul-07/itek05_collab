//Define the root endpoint for food items.
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// GET /api/fooditems
router.get('/', foodController.getAllFoodItems);

// Export the router so the main server file can use it
module.exports = router;
