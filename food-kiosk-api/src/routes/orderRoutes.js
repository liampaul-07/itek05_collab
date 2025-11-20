const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders/:id
router.get('/:id', orderController.indexById);

// GET /api/orders
router.get('/', orderController.index);

// POST /api/orders
router.post('/', orderController.store);

// DELETE /api/orders/:id
router.delete('/:id', orderController.destroy);

// PUT /api/orders/status/:id
router.put('/status/:id', orderController.updateStatus);

module.exports = router;