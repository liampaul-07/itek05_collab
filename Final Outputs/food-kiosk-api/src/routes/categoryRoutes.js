const express = require('express');
const router = express.Router(); 
const categoryController = require('../controllers/categoryController');

// --- READ Operations ---

// 1. GET all categories (Controller method: index)
router.get('/', categoryController.index);

// 2. GET only active categories (Controller method: indexActive)
router.get('/active', categoryController.indexActive);

// 3. GET category by ID (Controller method: show)
router.get('/:id', categoryController.show);

// --- CREATE Operation ---

// 4. POST a new category (Controller method: store)
router.post('/', categoryController.store);

// --- UPDATE Operation ---

// 5. PUT update category by ID (Controller method: update)
router.put('/:id', categoryController.update);

// --- DELETE Operation ---

// 6. DELETE category by ID (Controller method: destroy)
router.delete('/remove/:id', categoryController.destroy);

module.exports = router;