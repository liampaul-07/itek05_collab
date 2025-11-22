const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController'); 

// --- CREATE Operation ---

// POST a new discount (Controller method: store)
router.post('/', discountController.store);

// --- READ Operations ---

// GET all discounts (Controller method: index)
router.get('/', discountController.index);

// GET discount by code (Controller method: indexByCode)
router.get('/apply', discountController.indexByCode);

// GET discount usage (Controller method: indexDiscountUsage)
router.get('/usage/:id', discountController.indexDiscountUsage);

// --- UPDATE Operation ---

// PUT update discount by ID (Controller method: update)
router.put('/:id', discountController.update);

// --- DELETE Operation ---

// PUT delete discount by ID (Controller method: destroy)
router.put('/remove/:id', discountController.destroy); 

module.exports = router;