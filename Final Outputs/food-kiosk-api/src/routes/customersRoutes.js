const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController'); 

// --- READ Operations ---

// 1. GET all customers (Controller method: index)
router.get('/', customerController.index);

// 2. GET customer by ID (Controller method: show)
router.get('/:id', customerController.show);

// --- CREATE Operation ---

// 3. POST a new customer (Controller method: store)
router.post('/', customerController.store);

// --- UPDATE Operation ---

// 4. PUT update customer by ID (Controller method: update)
router.put('/:id', customerController.update);

// --- DELETE Operation ---

// 5. DELETE customer by ID (Controller method: destroy)
router.delete('/:id', customerController.destroy); 

module.exports = router;