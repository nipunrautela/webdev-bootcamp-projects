// jshint esversion:6

const express = require("express");
const app = express();

app.get("/", function(request, response) {
  // console.log(request);
  response.send("<h1>Hello World</h1>");
});

app.get("/contact", function(req, res) {
  res.send("Contact me at: angela@gmail.com");
});

app.get("/about", function(req, res) {
  res.send("I am Nipun Rautela, a Third Year Engineering student at Vellore Institute of Technology, Chennai.");
});

app.get("/hobbies", function(req, res) {
  res.send("<ul><li>Drawing</li><li>Video Games</li><li>Sleeping</li></ul>");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
