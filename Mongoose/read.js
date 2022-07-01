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

Fruit.findOne({name: "Apple"}, function(err, fruit) {
  if (err) {
    console.log(err);
  }
  else {

    mongoose.connection.close();
    let realFruit = new Fruit(fruit);
    console.log(typeof(realFruit));
    console.log(realFruit);
    // fruits.forEach(function(fruit) {
    //   console.log(fruit.name);
    // });
  }
});

// Fruit.updateOne({_id: "62bdf496d39df9271124753f"}, {review: "hello world"}, function(err) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("Successfully updated the document");
//   }
// });


// const personSchema = new mongoose.Schema({
//   name: String,
//   age: Number
// });
//
// const Person = new mongoose.model("Person", personSchema);
