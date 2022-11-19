const async = require("async");
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

exports.category_create_get = (req, res) => {
  res.send("category create get")
};

exports.category_create_post = (req, res) => {
  res.send("category create post")
};

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