const express = require('express');

const router = express.Router();

const instrumentController = require('../controllers/instrumentController');
const categoryController = require('../controllers/categoryController');

// INSTRUMENTS
// routes to display instruments: all and a single one
router.get('/instruments', instrumentController.instrument_list);
router.get('/instruments/:id', instrumentController.instrument_detail);

// routes to create instruments
router.get('/instruments/create', instrumentController.instrument_create_get);
router.post('/instruments/create', instrumentController.instrument_create_post);

// routes to update instruments
router.get('/instruments/:id/update', instrumentController.instrument_update_get);
router.post('/instruments/:id/update', instrumentController.instrument_update_post);

// routes to delete instruments
router.get('/instruments/:id/delete', instrumentController.instrument_create_get);
router.post('/instruments/:id/delete', instrumentController.instrument_create_post);

// CATEGORIES
// routes to display categories
router.get('/categories', categoryController.category_list);
router.get('/categories/:id', categoryController.category_detail);

// routes to create categories
router.get('/categories/create', categoryController.category_create_get);
router.post('/categories/create', categoryController.category_create_post);

// routes to update categories
router.get('/categories/:id/update', categoryController.category_update_get);
router.post('/categories/:id/update', categoryController.category_update_post);

// routes to delete categories
router.get('/categories/:id/delete', categoryController.category_create_get);
router.post('/categories/:id/delete', categoryController.category_create_post);

module.exports = router;