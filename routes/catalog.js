const express = require('express');

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './public/images/items')
  },

  filename: (req, file, cb) => {
    const suffix = Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${suffix}`)
  }
})

const upload = multer({ storage: storage })

const instrumentController = require('../controllers/instrumentController');
const categoryController = require('../controllers/categoryController');

// INSTRUMENTS

// routes to create instruments
router.get('/instruments/create', instrumentController.instrument_create_get);
router.post('/instruments/create', upload.single("image"), instrumentController.instrument_create_post);

// routes to update instruments
router.get('/instruments/:id/update', instrumentController.instrument_update_get);
router.post('/instruments/:id/update', upload.single("image"), instrumentController.instrument_update_post);

// routes to delete instruments
router.get('/instruments/:id/delete', instrumentController.instrument_delete_get);
router.post('/instruments/:id/delete', instrumentController.instrument_delete_post);

// routes to display instruments: all and a single one
router.get('/instruments', instrumentController.instrument_list);
router.get('/instruments/:id', instrumentController.instrument_detail);


// CATEGORIES


// routes to create categories
router.get('/categories/create', categoryController.category_create_get);
router.post('/categories/create', categoryController.category_create_post);

// routes to update categories
router.get('/categories/:id/update', categoryController.category_update_get);
router.post('/categories/:id/update', categoryController.category_update_post);

// routes to delete categories
router.get('/categories/:id/delete', categoryController.category_delete_get);
router.post('/categories/:id/delete', categoryController.category_delete_post);

// routes to display categories
router.get('/categories', categoryController.category_list);
router.get('/categories/:id', categoryController.category_detail);

module.exports = router;