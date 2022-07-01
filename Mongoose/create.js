const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/";
const dbName = "fruitsDB";

console.log(url+dbName);
mongoose.connect(url+dbName);

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

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


// fruit.save();

const personSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const Person = new mongoose.model("Person", personSchema);

const person = new Person({
  name: "John",
  age: 37
});

// person.save();


const kiwi = new Fruit({
  name: "Kiwi",
  score: 9,
  review: "Sussy"
});

const orange = new Fruit({
  name: "Orange",
  score: 7,
  review: "Sour juicy"
});

const banana = new Fruit({
  name: "Banana",
  score: 8,
  review: "nice fruit"
});

Fruit.insertMany([
  kiwi,
  orange,
  banana
], function(err) {
  console.log(err);
});
