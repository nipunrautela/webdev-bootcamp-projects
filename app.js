//jshint esversion:6

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

// setting the templating library to ejs
app.set("view engine", "ejs");

// using body parser to get the request content
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://nipun:${process.env.MONGOKEY}@cluster0.fuuog2c.mongodb.net/todolistDB`);

const itemsSchema = {
  name: String
}

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Buy Food"
});
const item2 = new Item({
  name: "Cook Food"
});
const item3 = new Item({
  name: "Eat Food"
});

const defaultItems = [item1, item2, item3]
// Item.insertMany(defaultItems, function(err) {
//   if (err) console.log(err);
//   else {
//     console.log("successfully saved default items to database");
//   }
// });

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("list", listSchema);


app.get("/", function(req, res) {
  Item.find({}, function(err, result) {
    if (err) console.log(err);
    else {
      // console.log(result);
      res.render("list", {listTitle: "Today", itemsList: result});
    }
  });
});

app.get("/:listName", function(req, res) {
  const listName = _.capitalize(req.params.listName);
  // console.log(listName);

  List.findOne({name: listName}, function(err, result) {

    if (!err) {
      if (!result) {
        const list = new List({
          name: listName,
          items: defaultItems
        });
        console.log(list.name);

        list.save();
        res.redirect("/"+listName);
      }
      else {
        res.render("list", {listTitle: listName, itemsList: result.items});
      }
    }
  });


});

app.post("/", function(req, res) {
  // console.log(req.body);
  let itemName = req.body.newItemName;
  let listName = req.body.list;

  let item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  }
  else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }

});

app.post("/delete", function(req, res) {
  let deleteId = req.body.checkbox;
  let listName = req.body.list;

  if (listName === "Today") {
    if (deleteId) {
      Item.deleteOne({_id: deleteId}, function(err) {
        if (err) console.log(err);
        else {
          console.log("Successfully deleted");
        }
      })
    }
    res.redirect("/");
  }
  else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteId}}}, function(err, result) {
      if (!err) {
        res.redirect("/"+listName);
      }
    });
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
