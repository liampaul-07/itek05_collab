const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST
router.post('/', orderController.store)

// GET
router.get('/:orderId', orderController.show);
router.get('/', orderController.index);

// PUT /api/orders/status/:id
router.put('/status/:orderId', orderController.updateStatus);

// DELETE /api/orders/:id
router.delete('/:orderId', orderController.destroy);

module.exports = router;