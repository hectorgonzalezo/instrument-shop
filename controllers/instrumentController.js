const Instrument = require("../models/instrument");
const Category = require("../models/category");

exports.instrument_list = (req, res, next) => {
  Instrument.find()
    .populate("categories")
    .exec( (err, instruments) => {
      if (err){
        return next(err);
      }
      res.render("instruments_list", { title: "all instruments", instruments });
    })
};

exports.instrument_detail = (req, res, next) => {
  Instrument.findById(req.params.id)
    .populate("categories")
    .exec((err, instrument) => {
      if (err){
        return next(err);
      }
      res.render("instrument_detail", {instrument})
    })
};

exports.instrument_create_get = (req, res) => {
  res.send("Instrument create get")
};

exports.instrument_create_post = (req, res) => {
  res.send("Instrument create post")
};

exports.instrument_update_get = (req, res) => {
  res.send("Instrument update get")
};

exports.instrument_update_post = (req, res) => {
  res.send("Instrument update post")
};

exports.instrument_delete_get = (req, res) => {
  res.send("Instrument delete get")
};

exports.instrument_delete_post = (req, res) => {
  res.send("Instrument delete post")
};