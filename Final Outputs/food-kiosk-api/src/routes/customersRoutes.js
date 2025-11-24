const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController'); 

// GET Requests
router.get('/', customerController.index);

router.get('/:customerId', customerController.show);

// POST Requests
router.post('/', customerController.store);

// PUT Requests
router.put('/:customerId', customerController.update);
router.put('/active/:customerId', customerController.updateActive); 

// DELETE Requests
router.delete('/:customerId', customerController.destroy); 

module.exports = router;