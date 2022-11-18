const mongoose = require("mongoose");

const { Schema } = mongoose;

const InstrumentModelSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true},
  model: String,
  description: {type: String, default: ''},
  tuning: {
    type: String, 
    validate: {
      validator: (val) => /[a-gA-G]*[\b|\#]*/.test(val),
      message: "Incorrect tuning format"
    },
    required: false
  },
  imgUrl: { type: String, default: "" },
  // category is an array of ids pointing to categories in the database
  // they can be populated when queried
  //there should be at least one category
  categories: {
    type: [{ type: Schema.Types.ObjectId, ref: "CategoryModel" }],
    validate: {
      validator: (val) => val.length > 0,
      message: "Must have at least a category",
    },
    required: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0, min: 0 },
});

// returns true if there are items in stock
InstrumentModelSchema.virtual('inStock').get(function() {
  return this.stock > 0;
})

InstrumentModelSchema.virtual('url').get(function(){
  return `/catalog/instruments/${this._id}`
})

module.exports = mongoose.model("Instrument", InstrumentModelSchema)
