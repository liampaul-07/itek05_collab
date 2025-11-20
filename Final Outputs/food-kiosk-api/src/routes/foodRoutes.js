//Define the root endpoint for food items.
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// GET /api/fooditems
router.get('/', foodController.index);

// POST /api/fooditems 
router.post('/', foodController.store);

// PUT /api/fooditems/:id 
router.put('/:id', foodController.update);

router.delete('/:id', foodController.destroy);

// Export the router so the main server file can use it
module.exports = router;
