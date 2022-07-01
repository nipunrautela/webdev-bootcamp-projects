const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/";
const dbName = "fruitsDB";

// console.log(url+dbName);
mongoose.connect(url+dbName);

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please check your data entry, no name provided."]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

Fruit.deleteOne({name: "Orange"}, function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Successfully deleted the document.");
  }
});
