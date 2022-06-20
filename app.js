//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

var items = ["Buy Food", "Cook Food", "Eat Food"];
var workItems = [];

// setting the templating library to ejs
app.set("view engine", "ejs");

// using body parser to get the request content
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/", function(req, res) {

  let day = date.getDate();
  res.render("list", {listTitle: day, itemsList: items});

});

app.post("/", function(req, res) {
  let item = req.body.newItemName;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  }
  else {
    items.push(item);
    res.redirect("/");
  }

});


app.get("/work", function(req, res) {

  res.render("list", {listTitle: "Work", itemsList: workItems});

});

app.post("/work", function (req, res) {
  let item = req.body.newItemName;
  workItems.push(item);

  res.redirect("/work");

});


app.get("/about", function(req, res) {
  res.render("about");
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started...");
});
