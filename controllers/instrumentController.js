const { body, validationResult } = require("express-validator");
const async = require("async");
const Instrument = require("../models/instrument");
const Category = require("../models/category");

// Display all instruments
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

// Show a details about a single instrument
exports.instrument_detail = (req, res, next) => {
  Instrument.findById(req.params.id)
    .populate("categories")
    .exec((err, instrument) => {
      if (err){
        return next(err);
      }
      res.render("instrument_detail", {
        title: "Instrument display",
        instrument,
      });
    })
};

// Display form to create a new instrument
exports.instrument_create_get = (req, res) => {
  // get all categories to render in instrument form
  Category.find().exec((err, categories) => {
    res.render("instruments_create", {
      title: "Create new instrument",
      categories,
    });
  })
};

// Manages sending create instrument form
// If data isn't correct, display it again
// otherwise display the instrument page
exports.instrument_create_post = [
  body("name", "Instrument name required")
    .trim()
    .escape()
    .isLength({ min: 3, max: 25 })
    .withMessage("Instrument name must be between 3 and 25 characters long")
    .isAlpha()
    .withMessage("Instrument name can only contain letters or numbers"),
  body("brand", "Instrument brand required")
    .trim()
    .escape()
    .isLength({ min: 3, max: 25 })
    .withMessage("Instrument brand must be between 3 and 25 characters long")
    .isAlpha()
    .withMessage("Instrument brand can only contain letters or numbers"),
  body("model")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Instrument model can only contain letters or numbers"),
  body("description", "Instrument description required")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Instrument description must be at most 100 characters long"),
  body("tuning")
    .trim(),
  body("price")
    .trim()
    .escape()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Price should be at least 1"),
  body("stock")
    .trim()
    .escape()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Stock should be at least 1"),
    (req, res, next) =>{
      // Get validations
      const errors = validationResult(req);
      // get chosen fields
      let categoriesArray = Object.keys(req.body).filter((field) => /.*-category/.test(field));
      console.log(categoriesArray.length);
      console.log(errors.array())
  
      // If there are any errors, rerender form with previous values and error messages
      // or if no category is chosen
      if(!errors.isEmpty() || categoriesArray.length < 1) {
        const noCategoryError = { msg: "Choose at least one category"}

        Category.find().exec((err, categories) => {
          res.render("instruments_create", {
            title: "Create new instrument",
            instrument: req.body,
            categories,
            errors: categoriesArray.length < 1 ? [...errors.array(), noCategoryError] :  errors.array(),
          });
        })
        return;
      }

      // Make an array full of categories

      categoriesArray = categoriesArray.map((category) => category.match(/.*(?=-category)/)[0])
      // look for chosen categories, add them to array and then save instrument
      Category.find({ name: { $in: categoriesArray }}).exec((err, categories) => {
        if (err) {
          return next(err);
        }
      const categoriesIds = categories.map((category) => category._id)
  
      // If it's valid, add the category to database and open record
      const instrument = new Instrument({
        name: req.body.name,
        brand: req.body.brand,
        ...(req.body.model !== '') && { model: req.body.model },
        ...(req.body.description !== '') && { description: req.body.description },
        ...(req.body.tuning !== '') && { tuning: req.body.tuning },
        categories: categoriesIds,
        price: req.body.price,
        stock: req.body.stock,
      });

      instrument.save((instrumentErr) => {
        if (instrumentErr) {
          return next(instrumentErr);
        }
  
        // If created sucessfully, go to category page
        res.redirect(instrument.url);
      })
    })
    }
]

exports.instrument_update_get = (req, res, next) => {
  async.parallel(
    {
      instrument(callback){
        Instrument.findById(req.params.id).populate("categories").exec(callback);
      },
      categories(callback){
        Category.find().exec(callback);
      }
    },
      (err, results) => {
        if (err) {
          return next(err);
        }

        res.render("instruments_create", {
          title: "Update instrument",
          instrument: results.instrument,
          categories: results.categories,
        });
      }
  )
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