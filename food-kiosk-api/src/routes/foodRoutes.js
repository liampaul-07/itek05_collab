//Define the root endpoint for food items.
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

//Specific paths
router.get('/category/:id', foodController.indexByCategory);
router.get('/available', foodController.indexAvailable);

// GET /api/fooditems/:id
router.get('/:id', foodController.indexById);

// GET /api/fooditems
router.get('/', foodController.index);

// POST /api/fooditems 
router.post('/', foodController.store);

// PUT /api/fooditems/available/:id
router.put('/available/:id', foodController.updateAvailability);

// PUT api/fooditems/stock/:id
router.put('/stock/:id', foodController.updateStock);

// PUT /api/fooditems/:id 
router.put('/:id', foodController.update);

// DELETE /api/fooditems/:id
router.delete('/remove/:id', foodController.destroy);

// Export the router so the main server file can use it
module.exports = router;
