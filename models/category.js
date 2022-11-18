
const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategoryModelSchema = new Schema({
  name: { type: String,  required: true },
  description: { type: String, required: true },
});


CategoryModelSchema.virtual('url').get(function(){
  return `/catalog/categories/${this._id}`
})

module.exports = mongoose.model("CategoryModel", CategoryModelSchema)
