const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//----------------------Requests targeting all Articles----------------------//
app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, articles) {
      res.header({ contentType: "application/json" });
      if (err) {
        res.send(err);
      } else {
        res.send(articles);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//----------------------Requests targeting specific Articles----------------------//
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    res.header({ contentType: "application/json" });
    Article.findOne(
      {
        title: req.params.articleTitle,
      },
      function (err, article) {
        if (err) {
          res.send(err);
        } else if (!article) {
          res.send("No such article found");
        } else {
          res.send(article);
        }
      }
    );
  })
  .put(function (req, res) {
    Article.replaceOne(
      {
        title: req.params.articleTitle,
      },
      {
        title: req.body.title,
        content: req.body.content,
      },
      function (err) {
        if (!err) {
          res.send("Successfully replaced the article.");
        } else {
          res.send("There was an error.");
          console.log(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      {
        title: req.params.articleTitle,
      },
      {
        $set: req.body,
      },
      function (err) {
        if (!err) {
          res.send("Successfully updated the article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne(
      {
        title: req.params.articleTitle,
      },
      function (err) {
        if (!err) {
          res.send("Successfully deleted the article.");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
