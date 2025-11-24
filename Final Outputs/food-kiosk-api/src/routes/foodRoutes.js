const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// POST /api/fooditems 
router.post('/', foodController.store);

// GET 
router.get('/category/:categoryId', foodController.indexByCategory);
router.get('/available', foodController.indexAvailable);
router.get('/:foodId', foodController.show);
router.get('/', foodController.index);

// PUT 
router.put('/available/:foodId', foodController.updateAvailability);
router.put('/stock/:foodId', foodController.updateStock);
router.put('/:foodId', foodController.update);

// DELETE
router.delete('/:foodId', foodController.destroy);

module.exports = router;
