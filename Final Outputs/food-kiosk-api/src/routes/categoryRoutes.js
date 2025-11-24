const express = require('express');
const router = express.Router(); 
const categoryController = require('../controllers/categoryController');

// POST REQUEST
router.post('/', categoryController.store);

// GET Requests
router.get('/', categoryController.index);

router.get('/:categoryId', categoryController.show);

router.get('/active', categoryController.indexActive);

// PUT REQUEST
router.put('/:categoryId', categoryController.update);

// DELETE 
router.delete('/:categoryId', categoryController.destroy);

module.exports = router;