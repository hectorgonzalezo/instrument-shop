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
    res.render('categories_list', { title: "All instrument categories", categories})
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

exports.category_update_get = (req, res) => {
  res.send("category update get")
};

exports.category_update_post = (req, res) => {
  res.send("category update post")
};

exports.category_delete_get = (req, res) => {
  res.send("category delete get")
};

exports.category_delete_post = (req, res) => {
  res.send("category delete post")
};