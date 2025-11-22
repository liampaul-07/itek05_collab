const express = require('express');
const router = express.Router();
const orderDetailController = require ('../controllers/orderDetailController');

// POST 
router.post('/:id/details', orderDetailController.store);

// PUT
router.put('/:orderId/details/:detailId', orderDetailController.update);

// GET by OrderDetailId
router.get('/:orderId/details/:detailId', orderDetailController.indexByDetailId);

// GET by OrderId
router.get('/:orderId/details/', orderDetailController.indexByOrderId);

// DELETE 
router.delete('/:orderId/details/:detailId', orderDetailController.destroy);

module.exports = router;