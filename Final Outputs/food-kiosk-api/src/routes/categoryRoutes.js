const express = require('express');
const router = express.Router(); 
const categoryController = require('../controllers/categoryController');

// GET all categories (Controller method: index)
router.get('/', categoryController.index);

// GET only active categories (Controller method: indexActive)
router.get('/active', categoryController.indexActive);

// GET category by ID (Controller method: show)
router.get('/:id', categoryController.show);

// POST new category (Controller method: store)
router.post('/', categoryController.store);

// PUT update category by ID (Controller method: update)
router.put('/:id', categoryController.update);

// DELETE category by ID (Controller method: destroy)
router.delete('/remove/:id', categoryController.destroy);

module.exports = router;