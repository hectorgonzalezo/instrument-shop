const Category = require("../models/category");

exports.category_list = (req, res) => {
  res.send("category list")
};

exports.category_detail = (req, res) => {
  res.send("category detail")
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