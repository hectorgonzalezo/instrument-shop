const async = require("async");
const { body, validationResult } = require("express-validator");
const Category = require("../models/category");
const Instrument = require("../models/instrument");

// List all categories
exports.category_list = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err){
      return next(err);
    }
    res.render('categories_list', { title: "All categories", categories})
  })
};

// Display details about a particular category
exports.category_detail = (req, res, next) => {
  // Get category and instruments that belong to it
  async.parallel({
    category(callback){
      Category.findById(req.params.id)
        .exec(callback)
    },
    instruments(callback){
      Instrument.find({categories: { $elemMatch: { $eq: req.params.id}}})
        .exec(callback)
    }
  },
  (err, results) => {
    if (err){
      return next(err)
    };
    // If no such category exists, throw error
    if (results.category === null){
      const newErr = new Error("Category not found")
      newErr.status = 404;
      return next(newErr);
    }
    // if successful, render
    res.render("category_detail", {
      title: "Category detail",
      category: results.category,
      instruments: results.instruments,
    })
  })
};

// Display form to create new category
exports.category_create_get = (req, res) => {
  res.render("categories_create", {title: "Create new category"});
}

// Manages sending create category form
// If data isn't correct, display it again
// otherwise display the category page
exports.category_create_post = [
  body("name", "Category name required")
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("Category name should be between 3 and 25 characters long")
    .escape()
    .isAlpha()
    .withMessage("Category name can only include letters"),
  body("description", "Category description required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category description should be between 3 and 100 characters long")
    .escape(),
  body("password","Admin password required")
    .trim()
    .escape()
    .equals("password")
    .withMessage("Wrong password"),
  (req, res, next) =>{
    // Get validations
    const errors = validationResult(req);

    // If there are any errors, rerender form with previous values and error messages
    if(!errors.isEmpty()) {
      res.render("categories_create", {
        title: "Create new category",
        category: req.body,
        errors: errors.array(),
      })
      return;
    }

    // If it's valid, add the category to database and open record
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    })

    category.save((err) => {
      if (err) {
        return next(err);
      }

      // If created sucessfully, go to category page
      res.redirect(category.url);
    })
  }
]

// Update a category
// shows category create page and populates it with previous category data
exports.category_update_get = (req, res) =>{
  Category.findById(req.params.id).exec((err, category) => {
    res.render("categories_create", { title: "Update category", category });
  })
}

// Similar to create_post, but finds the category by id before updating it
exports.category_update_post = [
  body("name", "Category name required")
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("Category name should be between 3 and 25 characters long")
    .escape()
    .isAlpha()
    .withMessage("Category name can only include letters"),
  body("description", "Category description required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category description should be between 3 and 100 characters long")
    .escape(),
  body("password","Admin password required")
    .trim()
    .escape()
    .equals("password")
    .withMessage("Wrong password"),
  (req, res, next) =>{
    // Get validations
    const errors = validationResult(req);

    // If there are any errors, rerender form with previous values and error messages
    if(!errors.isEmpty()) {
      res.render("categories_create", {
        title: "Create new category",
        category: req.body,
        errors: errors.array(),
      })
      return;
    }

    // If it's valid, add the category to database and open record
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    })

    Category.findByIdAndUpdate(req.params.id, category, {}, (err,  updatedCategory) => {
      if (err) {
        return next(err);
      }
      res.redirect(updatedCategory.url);
    })
  }
]

// Ask for confirmation to delete category
exports.category_delete_get = (req, res, next) => {
  // Get category and instruments that belong to it
  async.parallel({
    category(callback){
      Category.findById(req.params.id)
        .exec(callback)
    },
    instruments(callback){
      Instrument.find({categories: { $elemMatch: { $eq: req.params.id}}})
        .exec(callback)
    }
  },
  (err, results) => {
    if (err){
      return next(err)
    };
    // If no such category exists, throw error
    if (results.category === null){
      const newErr = new Error("Category not found")
      newErr.status = 404;
      return next(newErr);
    }
    // if successful, render
    res.render("category_detail", {
      title: "Category detail",
      category: results.category,
      instruments: results.instruments,
      deleting: true,
    })
  })
};

// Delete category
// validate admin password first
exports.category_delete_post = [
  body("password","Admin password required")
    .trim()
    .escape()
    .equals("password")
    .withMessage("Wrong password"),
    (req, res, next) => {
      // Get validations
    const errors = validationResult(req);

  // look if theres any instrument that still contains this category
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    instruments(callback) {
      Instrument.find({ categories: req.params.id }).exec(callback);
    },
  },
  (err, results) => {
    if (err) {
      return next(err);
    }

    // If there are any errors, rerender form with previous values and error messages
    if(!errors.isEmpty()) {
      res.render("category_detail", {
        title: "Category detail",
        category: results.category,
        instruments: results.instruments,
        deleting: true,
        error: true,
      })
      return;
    }

    // If there are any instruments in category ask the user to delete them
    if (results.instruments.length > 0) {
      res.render("category_detail", {
        title: "Category detail",
        category: results.category,
        instruments: results.instruments,
        deleting: true,
      })

    }

    // If there are none, delete the category
    Category.findByIdAndRemove(req.params.id).exec((categoryErr) => {
      if (categoryErr) {
        return next(categoryErr);
      }
      res.redirect("/catalog/categories")
    })
  }
  )
  }
]
